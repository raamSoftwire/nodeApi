const db = require('../models')
const User = db.user

exports.register = async (req, res) => {

    try {
        if (!req.body.name || !req.body.password) {
            res.status(400).send({message: 'Content can not be empty'})
        }
        const newUser = {name: req.body.name, password: req.body.password}
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

        if (user.password === password) {
            res.json({success: true, token: 'JWT here'})
        } else {
            res.status(401).send({success: false, message: 'Authentication failed. Wrong password'})
        }

    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}
