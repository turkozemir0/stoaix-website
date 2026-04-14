const bcrypt = require('bcryptjs')
const { getClient } = require('../_lib/supabase')
const { signToken } = require('../_lib/auth')
const { setCorsHeaders, handleOptions, sendError, sendJson } = require('../_lib/cors')

module.exports = async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed')

  const { email, password } = req.body || {}
  if (!email || !password) return sendError(res, 400, 'email and password are required')

  try {
    const supabase = getClient()

    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .select('id, slug, name, email, plan, tier, status, password_hash, is_admin')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (error || !affiliate) return sendError(res, 401, 'Invalid email or password')
    if (affiliate.status === 'suspended') return sendError(res, 403, 'Account suspended')

    const valid = await bcrypt.compare(password, affiliate.password_hash)
    if (!valid) return sendError(res, 401, 'Invalid email or password')

    const token = signToken({
      affiliateId: affiliate.id,
      slug: affiliate.slug,
      plan: affiliate.plan,
      isAdmin: affiliate.is_admin,
    })

    const { password_hash: _, ...safeAffiliate } = affiliate
    return sendJson(res, { token, affiliate: safeAffiliate })
  } catch (err) {
    console.error('Login error:', err)
    return sendError(res, 500, 'Internal server error')
  }
}
