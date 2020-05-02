const describe = require("mocha").describe;
const chai = require('chai');
const expect = require('chai').expect;

const app = require('../index.js');
const db = require('../models');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Auth', () => {

    beforeEach(async () => {
        await db.sequelize.sync({force: true});
    })

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const newUser = {name: "Alice", password: "Pa55word"}
            let res = await chai.request(app).post('/auth/register').send(newUser)

            expect(res.body).to.include({name: newUser.name});
            expect(res).to.have.status(201)
        });

        it('should return 400 if content is not given', async () => {
            let res = await chai.request(app).post('/auth/register')

            expect(res).to.have.status(400)
        });

        it('should return 400 if content does not contain a name and password', async () => {
            let res = await chai.request(app).post('/auth/register').send({name: 'Bob'})

            expect(res).to.have.status(400)
        })

        it('should hash the password before saving it', async () => {
            const newUser = {name: "Alice", password: "Pa55word"}
            let res = await chai.request(app).post('/auth/register').send(newUser)

            expect(res.body.password).to.not.equal(newUser.password)
        })
    });

    describe('POST /auth/sign-in', () => {
        it('should login a user', async () => {
            const user = {name: "Alice", password: "Pa55word"}
            await chai.request(app).post('/auth/register').send(user)
            let res = await chai.request(app).post('/auth/sign-in').send(user)

            expect(res.body).to.include.all.keys('success', 'token')
            expect(res.body.success).to.be.true
            expect(res).to.have.status(200);
        });

        it('should return 401 if user is not found', async () => {
            const user = {name: "Alice", password: "Pa55word"}
            let res = await chai.request(app).post('/auth/sign-in').send(user)

            expect(res).to.have.status(401);
        });

        it('should return 401 if password is incorrect', async () => {
            const user = {name: "Alice", password: "Pa55word"}
            await chai.request(app).post('/auth/register').send(user)
            let res = await chai.request(app).post('/auth/sign-in')
                .send({name: "Alice", password: "Wr0ng_Pa55word"})

            expect(res).to.have.status(401);
        })
    });
});
