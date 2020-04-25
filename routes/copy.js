const express = require('express')
const router = express.Router()
const Copy = require('../controllers/copy.js')

router.get('/',  Copy.findAll)

router.get('/:id', Copy.findById)

router.post('/', Copy.create)

router.delete('/:id', Copy.delete)

module.exports = router
