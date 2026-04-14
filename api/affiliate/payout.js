const { getClient } = require('../_lib/supabase')
const { requireAuth } = require('../_lib/auth')
const { setCorsHeaders, handleOptions, sendError, sendJson } = require('../_lib/cors')

const VALID_METHODS = ['bank_transfer', 'wise', 'paypal']

module.exports = async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed')

  let payload
  try {
    payload = requireAuth(req)
  } catch (err) {
    return sendError(res, err.status || 401, err.message)
  }

  const { method, holderName, account } = req.body || {}

  if (!method || !holderName || !account) {
    return sendError(res, 400, 'method, holderName, and account are required')
  }
  if (!VALID_METHODS.includes(method)) {
    return sendError(res, 400, 'Invalid payment method')
  }

  try {
    const supabase = getClient()
    const { error } = await supabase
      .from('affiliates')
      .update({ payout_info: { method, holderName, account } })
      .eq('id', payload.affiliateId)

    if (error) {
      console.error('Payout update error:', error)
      return sendError(res, 500, 'Failed to save payout info')
    }

    return sendJson(res, { ok: true })
  } catch (err) {
    console.error('Payout error:', err)
    return sendError(res, 500, 'Internal server error')
  }
}
