
const jwt = require('jsonwebtoken')

const createJWT = (email: string, userId: string, duration: number) => {
  const payload = {
    email,
    userId,
    duration,
  }
  return jwt.sign(payload, 'super_secret_token_secret', {
    expiresIn: duration,
  })
}

export { createJWT }
