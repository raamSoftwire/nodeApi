const express = require('express');
const router = express.Router();
const Loan = require("../controllers/loan.js");

router.get('/',  Loan.findAll);

router.get('/:id', Loan.findById);

router.post('/', Loan.create);

// router.put('/:id', Loan.update);

router.delete('/:id', Loan.delete);

module.exports = router;