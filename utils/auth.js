
const jwt = require('jsonwebtoken')

const createJWT = (email, userId, duration) => {
  const payload = {
    email,
    userId,
    duration,
  }
  return jwt.sign(payload, 'super_secret_token_secret', {
    expiresIn: duration,
  })
}

module.exports = { createJWT }
