const express = require('express')
const router = express.Router()

const { login, register, getUserFromToken } = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/getUser', getUserFromToken)

module.exports = router
