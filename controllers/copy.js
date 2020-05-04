const db = require('../models')
const Copy = db.copy
const Op = db.Sequelize.Op

exports.findAll = async (req, res) => {
    try {
        const title = req.query.title
        // TODO can we extend this to search on author too?
        // Op has an OR function
        const condition = title ? {title: { [Op.iLike]: `%${title}%`}} : null
        const copies = await Copy.findAll({where: condition})
        res.send(copies)
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}

exports.findById = async (req, res) => {
    try {
        const id = req.params.id
        if (isNaN(id)) {
            res.status(400).send({message: 'Copy ID must be a number'})
        }
        const copy = await Copy.findByPk(id)

        if (!copy) {
            res.status(404).send({message : 'Copy not found'})
        }

        res.send(copy)
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}

exports.create = async (req, res) => {
    try {
        if (!req.body.bookId) {
            res.status(400).send({message: 'Content can not be empty'})
            return
        }

        // TODO need to add a check here that the book exists in the DB
        const newCopy = {book_id: req.body.bookId}
        await Copy.create(newCopy)
        res.status(201).send(newCopy)
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}

exports.delete = async (req, res) => {
    try {
        const id = req.params.id
        const copy = await Copy.findByPk(id)

        if (!copy) {
            res.status(404).send({message: 'Copy not found'})
        }

        await Copy.destroy({where: { id: id }})
        res.status(204).end()

        // TODO if that was the last copy of that book, then also remove the book?
        // Or leave it in, so we have a historic record of books we've had
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }

}
