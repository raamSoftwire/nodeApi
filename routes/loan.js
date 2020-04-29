const express = require('express')
const router = express.Router()
const Loan = require('../controllers/loan.js')

router.get('/',  Loan.findAll)

router.get('/:id', Loan.findById)

router.post('/', Loan.create)

module.exports = router
