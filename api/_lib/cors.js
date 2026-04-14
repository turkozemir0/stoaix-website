function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res)
    res.status(204).end()
    return true
  }
  return false
}

function sendError(res, status, message) {
  res.status(status).json({ error: message })
}

function sendJson(res, data) {
  res.status(200).json(data)
}

module.exports = { setCorsHeaders, handleOptions, sendError, sendJson }
