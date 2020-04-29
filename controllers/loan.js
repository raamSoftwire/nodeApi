const db = require('../models')
const moment = require('moment')
const Loan = db.loan

exports.findAll = async (req, res) => {
    try {
        const loans = await Loan.findAll()
        res.send(loans)
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}

exports.findById = async (req, res) => {
    try {
        const id = req.params.id
        if (isNaN(id)) {
            res.status(400).send({message: 'Loan ID must be a number'})
        }
        const loan = await Loan.findByPk(id)

        if (!loan) {
            res.status(404).send({message : 'Loan not found'})
        }

        res.send(loan)
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}

exports.create = async (req, res) => {
    try {
        if (!req.body.userId || !req.body.copyId) {
            res.status(400).send({message: 'Content can not be empty'})
            return
        }

        const newLoan = {
            user_id: req.body.userId,
            copy_id: req.body.copyId,
            return_due_date: moment().add(7, 'days').toDate()
        }
        await Loan.create(newLoan)
        res.status(201).send(newLoan)
    }
    catch {
        res.status(400).end({message: 'Something went wrong'})
    }
}

// exports.update = async (req, res) => {
//     //TODO look up current loan, only adjust the due date
//     // this endpoint doesn't need a body,
//     // it should just add 7 more days to the date
//
//     // const id = req.params.id;
//     // await Loan.update(req.body, {where: { id: id }});
//
//     // TODO think more carefully about what to return here
//     // Error handling and status codes
//     res.send("User updated");
// };

// exports.delete = async (req, res) => {
//     const id = req.params.id;
//     await Loan.destroy({where: { id: id }});
//      TODO Do we want to be deleting anything?
//      TODO It is probably better to mark them as returned and keep a historic record
//
//     res.send("Loan deleted")
// };
