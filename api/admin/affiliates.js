const { getClient } = require('../_lib/supabase')
const { requireAdmin } = require('../_lib/auth')
const { setCorsHeaders, handleOptions, sendError, sendJson } = require('../_lib/cors')

module.exports = async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return

  try {
    requireAdmin(req)
  } catch (err) {
    return sendError(res, err.status || 401, err.message)
  }

  const supabase = getClient()

  if (req.method === 'GET') {
    try {
      const { data: affiliates, error } = await supabase
        .from('affiliates')
        .select(`
          id, slug, name, email, plan, tier, status, created_at,
          affiliate_referrals ( id, converted_at, customer_id ),
          affiliate_commissions ( id, amount, status, period_month )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Admin affiliates error:', error)
        return sendError(res, 500, 'Failed to fetch affiliates')
      }

      const enriched = affiliates.map(a => ({
        ...a,
        totalReferrals: (a.affiliate_referrals || []).length,
        activeClients: (a.affiliate_referrals || []).filter(r => r.converted_at).length,
        totalCommissions: (a.affiliate_commissions || [])
          .reduce((sum, c) => sum + parseFloat(c.amount), 0)
          .toFixed(2),
        pendingCommissions: (a.affiliate_commissions || [])
          .filter(c => c.status === 'pending')
          .reduce((sum, c) => sum + parseFloat(c.amount), 0)
          .toFixed(2),
      }))

      return sendJson(res, { affiliates: enriched })
    } catch (err) {
      console.error('Admin affiliates error:', err)
      return sendError(res, 500, 'Internal server error')
    }
  }

  return sendError(res, 405, 'Method not allowed')
}
