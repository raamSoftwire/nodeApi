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

    describe('PUT /users/:id', () => {
        it('should update user if correct content is given', async () => {
            const user = {name: "Bob", password: "Pa55word"}
            await chai.request(app).post('/auth/register').send(user)
            let signInRes = await chai.request(app).post('/auth/sign-in').send(user)
            const token = signInRes.body.token

            const updatedUser = {name: "Bob Smith"};
            let res = await chai.request(app).put('/users/1')
                .set('authorization', `Bearer ${token}`)
                .send(updatedUser)

            expect(res).to.have.status(204);
        });

        it('should return 401 if token is not provided', async () => {
            const user = {name: "Bob", password: "Pa55word"}
            await chai.request(app).post('/auth/register').send(user)
            await chai.request(app).post('/auth/sign-in').send(user)

            const updatedUser = {name: "Bob Smith"};
            let res = await chai.request(app).put('/users/1')
                .send(updatedUser)

            expect(res).to.have.status(401);
            expect(res.body.message).to.equal('No token provided.')
        });

        it('should return 400 if token is invalid', async () => {
            const user = {name: "Bob", password: "Pa55word"}
            await chai.request(app).post('/auth/register').send(user)
            await chai.request(app).post('/auth/sign-in').send(user)

            const updatedUser = {name: "Bob Smith"};
            let res = await chai.request(app).put('/users/1')
                .set('authorization', 'Bearer invalid_token')
                .send(updatedUser)

            expect(res).to.have.status(401);
            expect(res.body.message).to.equal('Invalid token.')
        });

        it('should return 404 if id is not found', async () => {
            const user = {name: "Bob", password: "Pa55word"}
            await chai.request(app).post('/auth/register').send(user)
            let signInRes = await chai.request(app).post('/auth/sign-in').send(user)
            const token = signInRes.body.token

            const updatedUser = {name: "Bob Smith"};
            let res = await chai.request(app).put('/users/1000')
                .set('authorization', `Bearer ${token}`)
                .send(updatedUser)

            expect(res).to.have.status(404);
        });

        it('should return 400 if content is not given', async () => {
            const user = {name: "Bob", password: "Pa55word"}
            await chai.request(app).post('/auth/register').send(user)
            let signInRes = await chai.request(app).post('/auth/sign-in').send(user)
            const token = signInRes.body.token

            let res = await chai.request(app).put('/users/1')
                .set('authorization', `Bearer ${token}`)

            expect(res).to.have.status(400);
        });

        it('should return 400 if content does not contain a name', async () => {
            const user = {name: "Bob", password: "Pa55word"}
            await chai.request(app).post('/auth/register').send(user)
            let signInRes = await chai.request(app).post('/auth/sign-in').send(user)
            const token = signInRes.body.token

            let res = await chai.request(app).put('/users/1')
                .set('authorization', `Bearer ${token}`)
                .send({age: 21})

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
