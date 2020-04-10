const express = require('express');
const router = express.Router();
const User = require("../controllers/user.js");

router.get('/',  User.findAll);

router.get('/:id', User.findById);

module.exports = router;