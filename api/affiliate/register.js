const bcrypt = require('bcryptjs')
const { getClient } = require('../_lib/supabase')
const { signToken } = require('../_lib/auth')
const { setCorsHeaders, handleOptions, sendError, sendJson } = require('../_lib/cors')

const VALID_PLANS = ['standard', 'wl_basic', 'wl_pro']

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 40)
}

async function generateUniqueSlug(supabase, name) {
  const base = slugify(name) || 'partner'
  let slug = base
  let counter = 1

  while (true) {
    const { data } = await supabase
      .from('affiliates')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!data) return slug
    slug = `${base}-${counter}`
    counter++
  }
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed')

  const { name, email, password, plan } = req.body || {}

  if (!name || !email || !password || !plan) {
    return sendError(res, 400, 'name, email, password and plan are required')
  }
  if (!VALID_PLANS.includes(plan)) {
    return sendError(res, 400, 'Invalid plan')
  }
  if (password.length < 8) {
    return sendError(res, 400, 'Password must be at least 8 characters')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendError(res, 400, 'Invalid email address')
  }

  try {
    const supabase = getClient()

    const { data: existing } = await supabase
      .from('affiliates')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existing) return sendError(res, 409, 'An account with this email already exists')

    const passwordHash = await bcrypt.hash(password, 12)
    const slug = await generateUniqueSlug(supabase, name)

    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .insert({
        slug,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        plan,
        tier: 'starter',
        status: 'active',
      })
      .select('id, slug, name, email, plan, tier, status, created_at')
      .single()

    if (error) {
      console.error('Register DB error:', error)
      return sendError(res, 500, 'Registration failed. Please try again.')
    }

    const token = signToken({
      affiliateId: affiliate.id,
      slug: affiliate.slug,
      plan: affiliate.plan,
      isAdmin: false,
    })

    return sendJson(res, { token, affiliate })
  } catch (err) {
    console.error('Register error:', err)
    return sendError(res, 500, 'Internal server error')
  }
}
