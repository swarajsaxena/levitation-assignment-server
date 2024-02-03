const { User } = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { createJWT } = require('../utils/auth')

const register = () => {
  let { email, password, name } = req.body.data
  console.log(email, password, name)

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.json({
          success: false,
          message: 'email already exists',
        })
      } else {
        User.findOne({ email })
          .then((user) => {
            if (user) {
              return res.json({
                success: false,
                message: 'username already exists',
              })
            } else {
              const newUser = new User({
                name: name,
                email: email,
                password: password,
              })
              bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                  if (err) throw err
                  newUser.password = hash
                  newUser
                    .save()
                    .then((any) => {
                      res.status(200).json({
                        success: true,
                        user: {
                          email: any.email,
                          id: any._id,
                          name: any.name,
                        },
                      })
                    })
                    .catch((err) => {
                      res.status(500).json({
                        success: false,
                        error: err.message,
                      })
                    })
                })
              })
            }
          })
          .catch((err) => {
            res.status(500).json({
              message: err.message,
            })
          })
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      })
    })
}

const login = () => {
  let { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.json({ success: false, message: "user doesn't exist" })
      } else {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res
                .status(200)
                .json({ success: false, message: 'password incorrect' })
            }
            let access_token = createJWT(
              user.email,
              user._id,
              3600
            )
            jwt.verify(
              access_token,
              'super_secret_token_secret',
              (err, decoded) => {
                if (err) {
                  res.status(500).json({ errors: err })
                }
                if (decoded) {
                  return res.status(200).json({
                    success: true,
                    user,
                  })
                }
              }
            )
          })
          .catch((err) => {
            res.status(500).json({ success: false, message: err })
          })
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err })
    })
}

const getUserFromToken = () => {
  const token = req.headers.auth_token

  jwt.verify(token, 'super_secret_token_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    } else {
      User.findById(decoded)
        .then((user) => {
          if (!user) {
            return res
              .status(404)
              .json({ success: false, message: 'User not found' })
          } else {
            return res.status(200).json({ success: true, user })
          }
        })
        .catch((err) => {
          return res.status(500).json({ success: false, message: err.message })
        })
    }
  })
}

module.exports = { register, login, getUserFromToken }