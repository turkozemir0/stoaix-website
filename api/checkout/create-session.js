const Stripe = require('stripe')
const { setCorsHeaders, handleOptions, sendError, sendJson } = require('../_lib/cors')

const VALID_PLANS = ['lite', 'plus', 'advanced', 'agency']

const PLAN_PRICES = {
  lite:     { amount: 7900,  name: 'STOAIX Lite Plan',     interval: 'month' },
  plus:     { amount: 14900, name: 'STOAIX Plus Plan',      interval: 'month' },
  advanced: { amount: 29900, name: 'STOAIX Advanced Plan',  interval: 'month' },
  agency:   { amount: 49900, name: 'STOAIX Agency Plan',    interval: 'month' },
}

const TRIAL_DAYS = 10

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {}
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=')
      return [key.trim(), val.join('=').trim()]
    })
  )
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed')

  const { plan, customerEmail, successUrl, cancelUrl } = req.body || {}

  if (!plan || !VALID_PLANS.includes(plan)) {
    return sendError(res, 400, 'Invalid or missing plan')
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return sendError(res, 500, 'Stripe not configured')

  // Read affiliate slug from cookie
  const cookies = parseCookies(req.headers.cookie)
  const affiliateSlug = cookies.stoaix_ref || null

  const origin = req.headers.origin || process.env.SITE_URL || 'https://stoaix.com'
  const priceData = PLAN_PRICES[plan]

  try {
    const stripe = Stripe(secretKey)

    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: { name: priceData.name },
            recurring: { interval: priceData.interval },
            unit_amount: priceData.amount,
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        metadata: {
          ...(affiliateSlug ? { affiliate_slug: affiliateSlug } : {}),
          plan,
        },
      },
      metadata: {
        ...(affiliateSlug ? { affiliate_slug: affiliateSlug } : {}),
        plan,
      },
      success_url: successUrl || `${origin}/signup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/checkout?plan=${plan}`,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return sendJson(res, { url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Stripe session error:', err)
    return sendError(res, 500, 'Failed to create checkout session')
  }
}
