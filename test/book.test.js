const describe = require("mocha").describe;
const chai = require('chai');
const expect = require('chai').expect;

const app = require('../app.js');
const db = require('../models');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Books', () => {

    beforeEach(async () => {
        await db.sequelize.sync({force: true});
    })

    describe('GET /books/', () => {
        it('should return all books', async () => {
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

            let res = await chai.request(app).get('/books/')
                
            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0].title).to.equal("10 Billion")
            expect(res.body[1].title).to.equal("What If")
            expect(res).to.have.status(200);
        });
    });

    describe('GET /books/:id', () => {
        it('should return book if id is found', async () => {
            await db.book.create({
                title: "Poverty Safari",
                author: "Darren McGarvey",
                isbn: "456-4-890"
            });

            let res = await chai.request(app).get('/books/1')
                
            expect(res.body.title).to.equal("Poverty Safari")
            expect(res).to.have.status(200);
        });

        it('should return 404 if id is not found', async () => {
            let res = await chai.request(app).get('/books/1000')
                
            expect(res).to.have.status(404);
        });

        it('should return 400 if id not valid', async () => {
            let res = await chai.request(app).get('/books/1abc')
                
            expect(res).to.have.status(400);
        })
    });

    describe('POST /books/', () => {
        it('should create book if correct content is given', async () => {
            const newBook = {
                title: "Poverty Safari",
                author: "Darren McGarvey",
                isbn: "456-4-890"
            };

            let res = await chai.request(app).post('/books/').send(newBook)
                
            expect(res.body).to.include({title: newBook.title});
            expect(res).to.have.status(201);
        });

        it('should return 400 if content is not given', async () => {
            let res = await chai.request(app).post('/books/')
                
            expect(res).to.have.status(400);
        });

        it('should return 400 if content does not contain a title, author or ISBN', async () => {
            let res = await chai.request(app).post('/books/')
                .send({publisher: "Penguin"})
                
            expect(res).to.have.status(400);
        })
    });

    describe('PUT /books/:id', () => {
        it('should update book if correct content is given', async () => {
            await db.book.create({
                title: "What If",
                author: "Randall Munroe",
                isbn: "123-4-890"
            });
            const updatedBook = {
                title: "What If? Serious Scientific Answers to Absurb Hypothetical Questions",
                author: "Randall Munroe",
                isbn: "123-4-890"
            };
            let res = await chai.request(app).put('/books/1').send(updatedBook)
                
            expect(res).to.have.status(204);
        });

        it('should return 404 if id is not found', async () => {
            const updatedBook = {
                title: "What If? Serious Scientific Answers to Absurb Hypothetical Questions",
                author: "Joe Bloggs",
                isbn: "123-4-890"
            };
            let res = await chai.request(app).put('/books/1').send(updatedBook)
                
            expect(res).to.have.status(404);
        });

        it('should return 400 if content is not given', async () => {
            await db.book.create({
                title: "What If",
                author: "Randall Munroe",
                isbn: "123-4-890"
            });
            let res = await chai.request(app).put('/books/1')
                
            expect(res).to.have.status(400);
        });

        it('should return 400 if content does not contain a title, author or ISBN', async () => {
            await db.book.create({
                title: "What If",
                author: "Randall Munroe",
                isbn: "123-4-890"
            });
            let res = await chai.request(app).put('/books/1').send({title: "Bhagavad Gita"})
                
            expect(res).to.have.status(400);
        })
    });

});
