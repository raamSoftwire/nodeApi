const db = require('../models')
const User = db.user
const Op = db.Sequelize.Op

exports.findAll = async (req, res) => {
    try {
        const name = req.query.name
        const condition = name ? {name: { [Op.iLike]: `%${name}%`}} : null
        const users = await User.findAll({where: condition})
        res.send(users)
    }
    catch {
        res.status(400).send({message: 'Something went wrong'})
    }
}

exports.findById = async (req, res) => {
    try {
        const id = req.params.id
        if (isNaN(id)) {
            res.status(400).send({message: 'User ID must be a number'})
        }

        const user = await User.findByPk(id)

        if (!user) {
            res.status(404).send({message : 'User not found'})
        }

        res.send(user)
    }
    catch {
        res.status(400).send({message: 'Something went wrong'})
    }
}

exports.create = async (req, res) => {
    try {
        if (!req.body.name) {
            res.status(400).send({message: 'Content can not be empty'})
        }
        const newUser = {name: req.body.name}
        await User.create(newUser)
        res.status(201).send(newUser)
    }
    catch {
        res.status(400).send({message: 'Something went wrong'})
    }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByPk(id)

        if (!user) {
            res.status(404).send({message : 'User not found'})
        }

        if (!req.body.name) {
            res.status(400).send({message: 'Content can not be empty'})
        }

        const newUser = {name: req.body.name}

        await User.update(newUser, {where: { id: id }})
        res.status(204).end()
    }
    catch {
        res.status(400).send({message: 'Something went wrong'})
    }

}

exports.delete = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByPk(id)

        if (!user) {
            res.status(404).send({message: 'User not found'})
        }

        await User.destroy({where: { id: id }})
        res.status(204).end()
    }
    catch {
        res.status(400).send({message: 'Something went wrong'})
    }
}
