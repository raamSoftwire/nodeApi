const db = require('../models');
const User = db.user;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
    const name = req.query.name;
    const condition = name ? {name: { [Op.iLike]: `%${name}%`}} : null;
    const users = await User.findAll({where: condition});
    res.send(users)
};

exports.findById = async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    res.send(user)
};

exports.create = async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const user = {name: req.body.name,};
    await User.create(user);
    res.send(user)
};

exports.update = async (req, res) => {
    const id = req.params.id;
    await User.update(req.body, {where: { id: id }});

    // TODO think more carefully about what to return here
    // Error handling and status codes
    res.send("User updated");
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    await User.destroy({where: { id: id }});

    // TODO think more carefully about what to return here
    // Error handling and status codes
    res.send("User deleted")
};