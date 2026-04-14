const { getClient } = require('./_lib/supabase')
const { setCorsHeaders } = require('./_lib/cors')

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90 // 90 days

module.exports = async function handler(req, res) {
  setCorsHeaders(res)

  // Extract slug from the rewritten path: /ref/:slug → query string via vercel rewrite
  const slug = req.query.slug || (req.url.split('/ref/')[1] || '').split('?')[0]

  if (!slug) {
    return res.redirect(302, '/')
  }

  try {
    const supabase = getClient()
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id, slug')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()

    if (affiliate) {
      // Track the click
      const visitorIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || ''
      await supabase.from('affiliate_referrals').insert({
        affiliate_id: affiliate.id,
        visitor_ip: visitorIp.split(',')[0].trim(),
      })

      res.setHeader(
        'Set-Cookie',
        `stoaix_ref=${slug}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`
      )
    }
  } catch (err) {
    console.error('Ref tracking error:', err)
  }

  const redirectTo = req.query.to || '/'
  return res.redirect(302, redirectTo)
}
