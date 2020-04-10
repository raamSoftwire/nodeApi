const db = require('../models');
const Copy = db.copy;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
    const title = req.query.title;
    // TODO can we extend this to search on author too?
    // Op has an OR function
    const condition = title ? {title: { [Op.iLike]: `%${title}%`}} : null;
    const copies = await Copy.findAll({where: condition});
    res.send(copies)
};

exports.findById = async (req, res) => {
    const id = req.params.id;
    const copy = await Copy.findByPk(id);
    res.send(copy)
};

exports.create = async (req, res) => {
    if (!req.body.bookId) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    // TODO need to add a check here that the book exists in thge DB
    const copy = {book_id: req.body.bookId,};
    await Copy.create(copy);
    res.send(copy)
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    await Copy.destroy({where: { id: id }});

    // TODO think more carefully about what to return here
    // Error handling and status codes
    res.send("Copy deleted")

    // TODO if that was the last copy of that book, then also remove the book?
    // Or leave it in, so we have a historic record of books we've had
};