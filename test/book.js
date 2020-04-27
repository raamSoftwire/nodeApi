const describe = require("mocha").describe;
const chai = require('chai');
const expect = require('chai').expect;

const chaiHttp = require('chai-http');
const app = require('../index.js');

const db = require('../models');

chai.use(chaiHttp);

// SQLite keeps track of the largest ROWID that a table has ever held using the special SQLITE_SEQUENCE table.
// This means that even if we destroy the data and reset the primary key with restartIdentity, the rowIds do not reset
// Therefore each test in this file adds to the DB and potentially affects the following tests

describe('Books', () => {

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

            chai.request(app).get('/books/')
                .end( (err, res) => {
                    expect(res.body).to.have.lengthOf(2);
                    expect(res.body[0].title).to.equal("10 Billion")
                    expect(res.body[1].title).to.equal("What If")
                    expect(res).to.have.status(200);
                })
        });
    });

    describe('GET /books/:id', () => {
        it('should return book if id is found', async () => {

            chai.request(app).get('/books/2')
                .end( (err, res) => {
                    expect(res.body[1].title).to.equal("What If")
                    expect(res).to.have.status(200);
                })
        });

        it('should return 404 if id is not found', async () => {
            chai.request(app).get('/books/1000')
                .end( (err, res) => {
                    expect(res).to.have.status(404);
                })
        });

        it('should return 400 if id not valid', async () => {
            chai.request(app).get('/books/1abc')
                .end( (err, res) => {
                    expect(res).to.have.status(400);
                })
        })
    });

    describe('POST /books/', () => {
        it('should create book if correct content is given', async () => {
            const newBook = {
                title: "Poverty Safari",
                author: "Darren McGarvey",
                isbn: "456-4-890"
            };

            chai.request(app).post('/books/')
                .send(newBook)
                .end( (err, res) => {
                    expect(res.body).to.include({title: newBook.title});
                    expect(res).to.have.status(201);
                })
        });

        it('should return 400 if content is not given', async () => {
            chai.request(app).post('/books/')
                .end( (err, res) => {
                    expect(res).to.have.status(400);
                })
        });

        it('should return 400 if content does not contain a title, author or ISBN', async () => {
            chai.request(app).post('/books/')
                .send({publisher: "Penguin"})
                .end( (err, res) => {
                    expect(res).to.have.status(400);
                })
        })
    });

    describe('PUT /books/:id', () => {
        it('should update book if correct content is given', async () => {
            const updatedBook = {
                title: "What If? Serious Scientific Answers to Absurb Hypothetical Questions",
                author: "Randall Munroe",
                isbn: "123-4-890"
            };
            chai.request(app).put('/books/2')
                .send(updatedBook)
                .end( (err, res) => {
                    expect(res).to.have.status(204);
                })
        });

        it('should return 404 if id is not found', async () => {
            const updatedBook = {
                title: "What If? Serious Scientific Answers to Absurb Hypothetical Questions",
                author: "Joe Bloggs",
                isbn: "123-4-890"
            };
            chai.request(app).put('/books/1000')
                .send(updatedBook)
                .end( (err, res) => {
                    expect(res).to.have.status(404);
                })
        });

        it('should return 400 if content is not given', async () => {
            chai.request(app).put('/books/2')
                .end( (err, res) => {
                    expect(res).to.have.status(400);
                })
        });

        it('should return 400 if content does not contain a title, author or ISBN', async () => {
            chai.request(app).put('/books/2')
                .send({title: "Bhagavad Gita"})
                .end( (err, res) => {
                    expect(res).to.have.status(400);
                })
        })
    });

});
