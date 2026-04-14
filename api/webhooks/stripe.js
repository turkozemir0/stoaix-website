const Stripe = require('stripe')
const { getClient } = require('../_lib/supabase')

// Vercel body parsing must be disabled for Stripe webhooks
module.exports.config = { api: { bodyParser: false } }

const TIER_THRESHOLDS = [
  { min: 10, tier: 'pro',     rate: 30 },
  { min: 5,  tier: 'growth',  rate: 20 },
  { min: 0,  tier: 'starter', rate: 10 },
]

const WL_RATE = 40
const WL_PLANS = ['wl_basic', 'wl_pro']

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function deriveTierRate(activeCount) {
  for (const t of TIER_THRESHOLDS) {
    if (activeCount >= t.min) return { tier: t.tier, rate: t.rate }
  }
  return { tier: 'starter', rate: 10 }
}

async function handleCheckoutCompleted(session, supabase) {
  const affiliateSlug = session.metadata?.affiliate_slug
  if (!affiliateSlug) return

  const customerId = session.customer
  const customerEmail = session.customer_details?.email || session.customer_email

  // Find the affiliate
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('id')
    .eq('slug', affiliateSlug)
    .eq('status', 'active')
    .maybeSingle()

  if (!affiliate) {
    console.warn(`Webhook: affiliate not found for slug "${affiliateSlug}"`)
    return
  }

  // Avoid duplicate referral for same customer
  const { data: existing } = await supabase
    .from('affiliate_referrals')
    .select('id')
    .eq('affiliate_id', affiliate.id)
    .eq('customer_id', customerId)
    .maybeSingle()

  if (existing) return

  await supabase.from('affiliate_referrals').insert({
    affiliate_id: affiliate.id,
    customer_id: customerId,
    lead_email: customerEmail,
    converted_at: new Date().toISOString(),
  })

  console.log(`Referral created: affiliate ${affiliateSlug} ← customer ${customerId}`)
}

async function handleInvoicePaid(invoice, supabase) {
  const customerId = invoice.customer
  if (!customerId) return

  // Find the referral for this customer
  const { data: referral } = await supabase
    .from('affiliate_referrals')
    .select('id, affiliate_id')
    .eq('customer_id', customerId)
    .maybeSingle()

  if (!referral) return // Customer not attributed to any affiliate

  const affiliateId = referral.affiliate_id

  // Get affiliate plan
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('id, plan, tier')
    .eq('id', affiliateId)
    .single()

  if (!affiliate) return

  // Avoid duplicate commission for same invoice
  const { data: dupCheck } = await supabase
    .from('affiliate_commissions')
    .select('id')
    .eq('affiliate_id', affiliateId)
    .eq('stripe_invoice_id', invoice.id)
    .maybeSingle()

  if (dupCheck) return

  // Determine commission rate
  let commissionRate
  if (WL_PLANS.includes(affiliate.plan)) {
    commissionRate = WL_RATE
  } else {
    // Count active clients for tier calculation
    const { count } = await supabase
      .from('affiliate_referrals')
      .select('id', { count: 'exact', head: true })
      .eq('affiliate_id', affiliateId)
      .not('converted_at', 'is', null)

    const { tier, rate } = deriveTierRate(count || 0)
    commissionRate = rate

    // Update tier if changed
    if (tier !== affiliate.tier) {
      await supabase
        .from('affiliates')
        .update({ tier })
        .eq('id', affiliateId)
    }
  }

  const invoiceAmount = invoice.amount_paid / 100 // Stripe amounts are in pence/cents
  const commissionAmount = (invoiceAmount * commissionRate) / 100
  const periodMonth = new Date(invoice.period_start * 1000).toISOString().slice(0, 7)

  await supabase.from('affiliate_commissions').insert({
    affiliate_id: affiliateId,
    referral_id: referral.id,
    amount: commissionAmount.toFixed(2),
    commission_rate: commissionRate,
    status: 'pending',
    period_month: periodMonth,
    stripe_invoice_id: invoice.id,
  })

  console.log(`Commission created: £${commissionAmount.toFixed(2)} (${commissionRate}%) for affiliate ${affiliateId}`)
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed')
    return
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !webhookSecret) {
    console.error('Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET')
    res.status(500).end('Stripe not configured')
    return
  }

  const stripe = Stripe(secretKey)
  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    res.status(400).end(`Webhook Error: ${err.message}`)
    return
  }

  const supabase = getClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object, supabase)
        break
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object, supabase)
        break
      default:
        // Unhandled event type — ignore silently
        break
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error(`Webhook handler error (${event.type}):`, err)
    res.status(500).end('Internal handler error')
  }
}
