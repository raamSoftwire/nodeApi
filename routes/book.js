const express = require('express');
const router = express.Router();
const Book = require("../controllers/book.js");

router.get('/',  Book.findAll);

router.get('/:id', Book.findById);

router.post('/', Book.create);

router.put('/:id', Book.update);

module.exports = router;