const db = require('../models');
const User = db.user;

exports.findAll = async (req, res) => {
    const users = await User.findAll();
    res.send(users)
};
