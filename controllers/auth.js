const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const privateKey = process.env.JWT_PRIVATE_KEY
const saltRounds = parseInt(process.env.JWT_SALT_ROUNDS, 10)
const User = db.user

exports.register = async (req, res) => {
    try {
        if (!req.body.name || !req.body.password) {
            res.status(400).send({message: 'Content can not be empty'})
        }

        const hash = await bcrypt.hash(req.body.password, saltRounds)
        const newUser = {name: req.body.name, password: hash}
        await User.create(newUser)
        res.status(201).send(newUser)
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}

exports.signIn = async (req, res) => {
    try {
        const name = req.body.name
        const password = req.body.password
        const user = await User.findOne({where: {name: name}})

        if (!user) {
            res.status(401).send({message: 'Authentication failed. User not found'})
        }

        const match = await bcrypt.compare(password, user.password)

        if (match) {
            const token = jwt.sign({ userId: user.id }, privateKey, { expiresIn: 60 * 15 })
            res.status(200).send({success: true, token})
        } else {
            res.status(401).send({success: false, message: 'Authentication failed. Wrong password'})
        }
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}
