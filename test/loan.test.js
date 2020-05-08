const describe = require("mocha").describe;
const chai = require('chai');
const expect = require('chai').expect;
const moment = require('moment')

const app = require('../app.js');
const db = require('../models');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Loans', () => {

    beforeEach(async () => {
        await db.sequelize.sync({force: true});
    })

    describe('GET /loans/', () => {
        it('should return all loans', async () => {
            await db.user.create({name: "Joe"});
            await db.user.create({name: "Jane"});
            await db.book.create({
                title: "10 Billion",
                author: "Stephen Emmott",
                isbn: "123-4-567"
            });
            await db.book.create({
                title: "What If",
                author: "Randall Munroe",
                isbn: "123-4-890"
            });
            await db.copy.create({book_id: 1})
            await db.copy.create({book_id: 2})

            await db.loan.create({
                user_id: 1,
                copy_id: 1,
                return_due_date: moment().add(7, 'days').toDate()
            })

            await db.loan.create({
                user_id: 2,
                copy_id: 2,
                return_due_date: moment().add(7, 'days').toDate()
            })
            let res = await chai.request(app).get('/loans')

            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0].user_id).to.equal(1);
            expect(res.body[1].user_id).to.equal(2);
            expect(res).to.have.status(200)
        });
    });

    describe('GET /loans/:id', () => {
        it('should return loan if id is found', async () => {
            await db.user.create({name: "Alice"});
            await db.book.create({
                title: "Poverty Safari",
                author: "Darren McGarvey",
                isbn: "456-4-890"
            });
            await db.copy.create({book_id: 1})
            await db.loan.create({
                user_id: 1,
                copy_id: 1,
                return_due_date: moment().add(7, 'days').toDate()
            })

            let res = await chai.request(app).get('/loans/1')

            expect(res.body.copy_id).to.equal(1);
            expect(res).to.have.status(200);

        });

        it('should return 404 if id is not found', async () => {
            let res = await chai.request(app).get('/loans/1000')

            expect(res).to.have.status(404);
        });

        it('should return 400 if id not valid', async () => {
            let res = await chai.request(app).get('/loans/1abc')

            expect(res).to.have.status(400);
        })
    });

    describe('POST /loans/', () => {
        it('should create loan if correct content is given', async () => {
            const newloan = {
                userId: 1,
                copyId: 2,
            };
            let res = await chai.request(app).post('/loans/').send(newloan)

            expect(res.body).to.include({user_id: newloan.userId});
            expect(res).to.have.status(201);
        });

        it('should return 400 if content is not given', async () => {
            let res = await chai.request(app).post('/loans/')

            expect(res).to.have.status(400);
        });

        it('should return 400 if content does not contain a name', async () => {
            let res = await chai.request(app).post('/loans/').send({age: 21})

            expect(res).to.have.status(400);
        })
    });
});
