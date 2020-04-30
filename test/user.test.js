const describe = require("mocha").describe;
const chai = require('chai');
const expect = require('chai').expect;

const app = require('../index.js');
const db = require('../models');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Users', () => {

    beforeEach(async () => {
        await db.sequelize.sync({force: true});
    })

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
            await db.user.create({name: "Alice"});
            let res = await chai.request(app).get('/users/1')

            expect(res.body.name).to.equal("Alice");
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
            await db.user.create({name: "Alice"});
            const updatedUser = {name: "Alice Smith"};
            let res = await chai.request(app).put('/users/1').send(updatedUser)

            expect(res).to.have.status(204);
        });

        it('should return 404 if id is not found', async () => {
            const updatedUser = {name: "Jane Doe"};
            let res = await chai.request(app).put('/users/1000').send(updatedUser)

            expect(res).to.have.status(404);
        });

        it('should return 400 if content is not given', async () => {
            await db.user.create({name: "Alice"});
            let res = await chai.request(app).put('/users/1')

            expect(res).to.have.status(400);
        });

        it('should return 400 if content does not contain a name', async () => {
            await db.user.create({name: "Alice"});
            let res = await chai.request(app).put('/users/1').send({age: 21})

            expect(res).to.have.status(400);
        })
    });

    describe('DELETE /users/:id', () => {
        it('should delete user if user is found', async () => {
            await db.user.create({name: "Alice"});
            let res = await chai.request(app).delete('/users/1')

            expect(res).to.have.status(204);
        });

        it('should return 404 if id is not found', async () => {
            let res = await chai.request(app).delete('/users/1000')

            expect(res).to.have.status(404);
        });
    });
});
