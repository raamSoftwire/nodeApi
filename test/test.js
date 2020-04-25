const describe = require("mocha").describe;
const chai = require('chai');
const expect = require('chai').expect;

const chaiHttp = require('chai-http');
const app = require('../index.js');

const db = require('../models');

chai.use(chaiHttp);

describe('Users', () => {
    
    describe('GET /users/', () => {
        it('should return all users', async () => {
            await db.user.create({name: "Joe"});
            await db.user.create({name: "Jane"});

            chai.request(app).get('/users/')
                .end( (err, res) => {
                    expect(res.body).to.have.lengthOf(2);
                    expect(res).to.have.status(200);
                })
        })
    });

    describe('GET /users/:id', () => {
        it('should return user if id is found', async () => {
            await db.user.create({name: "Joe"});

            chai.request(app).get('/users/1')
                .end( (err, res) => {
                    expect(res.body.name).to.equal("Joe");
                    expect(res).to.have.status(200);
                })
        });

        it('should return 404 if id is not found', async () => {
            chai.request(app).get('/users/1000')
                .end( (err, res) => {
                    expect(res).to.have.status(404);
                })
        });

        it('should return 400 if id not valid', async () => {
            chai.request(app).get('/users/1abc')
                .end( (err, res) => {
                    expect(res).to.have.status(400);
                })
        })
    });

    describe('POST /users/', () => {
        it('should create user if correct content is given', async () => {
            const newUser = {name: "Jane Doe"};

            chai.request(app).post('/users/')
                .send(newUser)
                .end( (err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.include({name: newUser.name});
                })
        });

        it('should return 400 if content is not given', async () => {
            chai.request(app).post('/users/')
                .end( (err, res) => {
                    expect(res).to.have.status(400);
                })
        });

        it('should return 400 if content does not contain a name', async () => {
            chai.request(app).post('/users/')
                .send({age: 21})
                .end( (err, res) => {
                    expect(res).to.have.status(400);
                })
        })
    });

    describe('PUT /users/:id', () => {
        it('should update user if correct content is given', async () => {
            await db.user.create({name: "Joe"});

            const updatedUser = {name: "Jane Doe"};
            chai.request(app).put('/users/1')
                .send(updatedUser)
                .end( (err, res) => {
                    expect(res).to.have.status(204);
                })
        });

        it('should return 404 if id is not found', async () => {
            const updatedUser = {name: "Jane Doe"};
            chai.request(app).put('/users/1000')
                .send(updatedUser)
                .end( (err, res) => {
                    expect(res).to.have.status(404);
                })
        });

        it('should return 400 if content is not given', async () => {
            await db.user.create({name: "Joe"});

            chai.request(app).put('/users/1')
                .end( (err, res) => {
                    expect(res).to.have.status(400);
                })
        });

        it('should return 400 if content does not contain a name', async () => {
            await db.user.create({name: "Joe"});

            chai.request(app).put('/users/1')
                .send({age: 21})
                .end( (err, res) => {
                    expect(res).to.have.status(400);
                })
        })
    });

    describe('DELETE /users/:id', () => {
        it('should delete user if user is found', async () => {
            await db.user.create({name: "Joe"});

            chai.request(app).delete('/users/1')
                .end( (err, res) => {
                    expect(res).to.have.status(204);
                })
        });

        it('should return 404 if id is not found', async () => {
            chai.request(app).delete('/users/66')
                .end( (err, res) => {
                    expect(res).to.have.status(404);
                })
        });
    });
});
