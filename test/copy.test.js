const describe = require("mocha").describe;
const chai = require('chai');
const expect = require('chai').expect;

const app = require('../app.js');
const db = require('../models');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Copies', () => {

    beforeEach(async () => {
        await db.sequelize.sync({force: true});
    })

    describe('GET /copies/', () => {
        it('should return all copies', async () => {
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
            let res = await chai.request(app).get('/copies')

            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0].book_id).to.equal(1)
            expect(res.body[1].book_id).to.equal(2)
            expect(res).to.have.status(200)
        });
    });

    describe('GET /copies/:id', () => {
        it('should return copy if id is found', async () => {
            await db.book.create({
                title: "10 Billion",
                author: "Stephen Emmott",
                isbn: "123-4-567"
            });
            await db.copy.create({book_id: 1})
            let res = await chai.request(app).get('/copies/1')

            expect(res.body.book_id).to.equal(1);
            expect(res).to.have.status(200);

        });

        it('should return 404 if id is not found', async () => {
            let res = await chai.request(app).get('/copies/1000')

            expect(res).to.have.status(404);
        });

        it('should return 400 if id not valid', async () => {
            let res = await chai.request(app).get('/copies/1abc')

            expect(res).to.have.status(400);
        })
    });

    describe('POST /copies/', () => {
        it('should create copy if correct content is given', async () => {
            await db.book.create({
                title: "Poverty Safari",
                author: "Darren McGarvey",
                isbn: "456-4-890"
            });
            const newCopy = {bookId: "3"};
            let res = await chai.request(app).post('/copies/').send(newCopy)

            expect(res.body).to.include({book_id: '3'});
            expect(res).to.have.status(201);
        });

        it('should return 400 if content is not given', async () => {
            let res = await chai.request(app).post('/copies/')

            expect(res).to.have.status(400);
        });

        it('should return 400 if content does not contain a name', async () => {
            let res = await chai.request(app).post('/copies/').send({age: 21})

            expect(res).to.have.status(400);
        })
    });

    describe('DELETE /copies/:id', () => {
        it('should delete copy if copy is found', async () => {
            await db.book.create({
                title: "10 Billion",
                author: "Stephen Emmott",
                isbn: "123-4-567"
            });
            await db.copy.create({book_id: 1})
            let res = await chai.request(app).delete('/copies/1')

            expect(res).to.have.status(204);
        });

        it('should return 404 if id is not found', async () => {
            let res = await chai.request(app).delete('/copies/1000')

            expect(res).to.have.status(404);
        });
    });
});
