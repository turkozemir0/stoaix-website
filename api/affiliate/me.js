const { getClient } = require('../_lib/supabase')
const { requireAuth } = require('../_lib/auth')
const { setCorsHeaders, handleOptions, sendError, sendJson } = require('../_lib/cors')

const TIER_RATES = { starter: 10, growth: 20, pro: 30 }
const WL_RATE = 40

function deriveTier(activeCount) {
  if (activeCount >= 10) return 'pro'
  if (activeCount >= 5) return 'growth'
  return 'starter'
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') return sendError(res, 405, 'Method not allowed')

  let payload
  try {
    payload = requireAuth(req)
  } catch (err) {
    return sendError(res, err.status || 401, err.message)
  }

  try {
    const supabase = getClient()
    const { affiliateId } = payload

    const [affiliateRes, referralsRes, commissionsRes] = await Promise.all([
      supabase
        .from('affiliates')
        .select('id, slug, name, email, plan, tier, status, payout_info, created_at')
        .eq('id', affiliateId)
        .single(),
      supabase
        .from('affiliate_referrals')
        .select('id, lead_email, converted_at, customer_id, created_at')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false }),
      supabase
        .from('affiliate_commissions')
        .select('id, amount, commission_rate, status, period_month, created_at')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false }),
    ])

    if (affiliateRes.error) return sendError(res, 404, 'Affiliate not found')

    const affiliate = affiliateRes.data
    const referrals = referralsRes.data || []
    const commissions = commissionsRes.data || []

    const activeClients = referrals.filter(r => r.converted_at && r.customer_id)
    const currentTier = affiliate.plan === 'standard'
      ? deriveTier(activeClients.length)
      : affiliate.tier

    const currentRate = ['wl_basic', 'wl_pro'].includes(affiliate.plan)
      ? WL_RATE
      : TIER_RATES[currentTier]

    const totalEarnings = commissions
      .filter(c => c.status !== 'pending' || true)
      .reduce((sum, c) => sum + parseFloat(c.amount), 0)

    const thisMonthKey = new Date().toISOString().slice(0, 7)
    const thisMonthEarnings = commissions
      .filter(c => c.period_month === thisMonthKey)
      .reduce((sum, c) => sum + parseFloat(c.amount), 0)

    const pendingPayout = commissions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + parseFloat(c.amount), 0)

    if (affiliate.plan === 'standard' && currentTier !== affiliate.tier) {
      await supabase
        .from('affiliates')
        .update({ tier: currentTier })
        .eq('id', affiliateId)
      affiliate.tier = currentTier
    }

    return sendJson(res, {
      affiliate: { ...affiliate, tier: currentTier },
      stats: {
        totalClicks: referrals.length,
        totalConversions: activeClients.length,
        currentRate,
        currentTier,
        totalEarnings: totalEarnings.toFixed(2),
        thisMonthEarnings: thisMonthEarnings.toFixed(2),
        pendingPayout: pendingPayout.toFixed(2),
      },
      clients: activeClients,
      commissions,
    })
  } catch (err) {
    console.error('Me error:', err)
    return sendError(res, 500, 'Internal server error')
  }
}
