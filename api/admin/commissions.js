const { getClient } = require('../_lib/supabase')
const { requireAdmin } = require('../_lib/auth')
const { setCorsHeaders, handleOptions, sendError, sendJson } = require('../_lib/cors')

const VALID_STATUSES = ['pending', 'approved', 'paid']

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
    const statusFilter = req.query.status

    let query = supabase
      .from('affiliate_commissions')
      .select(`
        id, amount, commission_rate, status, period_month, created_at,
        affiliates ( id, name, email, slug )
      `)
      .order('created_at', { ascending: false })

    if (statusFilter && VALID_STATUSES.includes(statusFilter)) {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query
    if (error) return sendError(res, 500, 'Failed to fetch commissions')
    return sendJson(res, { commissions: data })
  }

  if (req.method === 'PATCH') {
    const { id } = req.query
    const { status } = req.body || {}

    if (!id) return sendError(res, 400, 'Commission id required')
    if (!VALID_STATUSES.includes(status)) return sendError(res, 400, 'Invalid status')

    const { data, error } = await supabase
      .from('affiliate_commissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) return sendError(res, 500, 'Failed to update commission')
    return sendJson(res, { commission: data })
  }

  return sendError(res, 405, 'Method not allowed')
}
