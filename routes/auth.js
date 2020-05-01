const express = require('express')
const router = express.Router()
const Auth = require('../controllers/auth.js')

router.post('/register',  Auth.register)

router.post('/sign-in',  Auth.signIn)

module.exports = router
