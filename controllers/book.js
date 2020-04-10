const db = require('../models');
const Book = db.book;

exports.findAll = async (req, res) => {
    const books = await Book.findAll();
    res.send(books)
};

exports.findById = async (req, res) => {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    res.send(book)
};

exports.create = async (req, res) => {
    if (!req.body.title || !req.body.author || !req.body.isbn) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const book = {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn
    };
    await Book.create(book);

    // TODO need to also create an copy here
    res.send(book)
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const book = {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn
    }
    await Book.update(book, {where: { id: id }});

    // TODO think more carefully about what to return here
    // Error handling and status codes
    res.send("Book updated");
};
