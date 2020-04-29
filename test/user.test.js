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

describe('Users', () => {

    describe('GET /users/', () => {
        it('should return all users', async () => {
            await db.user.create({name: "Joe"});
            await db.user.create({name: "Jane"});
            let res = await chai.request(app).get('/users')

            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0].name).to.equal("Joe")
            expect(res.body[1].name).to.equal("Jane")
            expect(res).to.have.status(200)
        });
    });

    describe('GET /users/:id', () => {
        it('should return user if id is found', async () => {
            let res = await chai.request(app).get('/users/2')

            expect(res.body.name).to.equal("Jane");
            expect(res).to.have.status(200);

        });

        it('should return 404 if id is not found', async () => {
            let res = await chai.request(app).get('/users/1000')

            expect(res).to.have.status(404);
        });

        it('should return 400 if id not valid', async () => {
            let res = await chai.request(app).get('/users/1abc')

            expect(res).to.have.status(400);
        })
    });

    describe('POST /users/', () => {
        it('should create user if correct content is given', async () => {
            const newUser = {name: "Alice"};
            let res = await chai.request(app).post('/users/').send(newUser)

            expect(res.body).to.include({name: newUser.name});
            expect(res).to.have.status(201);
        });

        it('should return 400 if content is not given', async () => {
            let res = await chai.request(app).post('/users/')

            expect(res).to.have.status(400);
        });

        it('should return 400 if content does not contain a name', async () => {
            let res = await chai.request(app).post('/users/').send({age: 21})

            expect(res).to.have.status(400);
        })
    });

    describe('PUT /users/:id', () => {
        it('should update user if correct content is given', async () => {
            const updatedUser = {name: "Joe Bloggs"};
            let res = await chai.request(app).put('/users/1').send(updatedUser)

            expect(res).to.have.status(204);
        });

        it('should return 404 if id is not found', async () => {
            const updatedUser = {name: "Jane Doe"};
            let res = await chai.request(app).put('/users/1000').send(updatedUser)

            expect(res).to.have.status(404);
        });

        it('should return 400 if content is not given', async () => {
            let res = await chai.request(app).put('/users/2')

            expect(res).to.have.status(400);
        });

        it('should return 400 if content does not contain a name', async () => {
            let res = await chai.request(app).put('/users/1').send({age: 21})

            expect(res).to.have.status(400);
        })
    });

    describe('DELETE /users/:id', () => {
        it('should delete user if user is found', async () => {
            let res = await chai.request(app).delete('/users/1')

            expect(res).to.have.status(204);
        });

        it('should return 404 if id is not found', async () => {
            let res = await chai.request(app).delete('/users/1000')

            expect(res).to.have.status(404);
        });
    });
});
