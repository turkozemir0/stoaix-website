const jwt = require('jsonwebtoken')

const JWT_EXPIRY = '30d'

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Missing JWT_SECRET')
  return secret
}

function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: JWT_EXPIRY })
}

function verifyToken(token) {
  return jwt.verify(token, getSecret())
}

function extractToken(req) {
  const auth = req.headers.authorization
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7)
  return null
}

function requireAuth(req) {
  const token = extractToken(req)
  if (!token) throw { status: 401, message: 'Unauthorized' }
  try {
    return verifyToken(token)
  } catch {
    throw { status: 401, message: 'Invalid or expired token' }
  }
}

function requireAdmin(req) {
  const payload = requireAuth(req)
  if (!payload.isAdmin) throw { status: 403, message: 'Admin access required' }
  return payload
}

module.exports = { signToken, verifyToken, requireAuth, requireAdmin }
