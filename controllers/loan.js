const db = require('../models');
const Loan = db.loan;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
    const loans = await Loan.findAll();
    res.send(loans)
};

exports.findById = async (req, res) => {
    const id = req.params.id;
    const loan = await Loan.findByPk(id);
    res.send(loan)
};

exports.create = async (req, res) => {
    if (!req.body.userId || !req.body.copyId) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
// TODO add 7 days to the due date here
    const loan = {
        user_id: req.body.userId,
        copy_id: req.body.copyId,
        return_due_date: Date.now()
    };
    await Loan.create(loan);
    res.send(loan)
};

exports.update = async (req, res) => {
    //TODO look up current loan, only adjust the due date
    // this endpoint doesn't need a body,
    // it should just add 7 more days to the date

    // const id = req.params.id;
    // await Loan.update(req.body, {where: { id: id }});

    // TODO think more carefully about what to return here
    // Error handling and status codes
    res.send("User updated");
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    await Loan.destroy({where: { id: id }});

    // TODO think more carefully about what to return here
    // Error handling and status codes
    res.send("Loan deleted")
};