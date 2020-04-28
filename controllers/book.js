const db = require('../models')
const Book = db.book

exports.findAll = async (req, res) => {
    try {
        const books = await Book.findAll()
        res.send(books)
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}

exports.findById = async (req, res) => {
    try {
        const id = req.params.id
        if (isNaN(id)) {
            res.status(400).send({message: 'Book ID must be a number'})
        }
        const book = await Book.findByPk(id)

        if(!book) {
            res.status(404).send({message: 'Book not found'})
        }

        res.send(book)
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}

exports.create = async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.isbn) {
            res.status(400).send({message: 'Content can not be empty'})
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            isbn: req.body.isbn
        }
        await Book.create(newBook)

        // TODO need to also create a copy here
        res.status(201).send(newBook)
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id
        const book = await Book.findByPk(id)

        if(!book) {
            res.status(404).send({message: 'Book not found'})
        }

        if (!req.body.title || !req.body.author || !req.body.isbn) {
            res.status(400).send({message: 'Content can not be empty'})
        }

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            isbn: req.body.isbn
        }

        await Book.update(newBook, {where: { id: id }})
        res.status(204).end()
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}
