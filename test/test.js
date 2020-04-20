const describe = require("mocha").describe;
const chai = require('chai');
const expect = require('chai').expect;

const chaiHttp = require('chai-http');
const app = require('../index.js');

chai.use(chaiHttp);

describe('Users', () => {
    describe('GET /users/', () => {
        it('should return all users', (done) => {
            chai.request(app).get('/users/')
                .end( (err, res) => {
                    console.log(res);
                    expect(res).to.have.status(200);
                    done();
                })

        })
    });

    describe('GET /users/:id', () => {
        it('should return user if id is found', (done) => {
            chai.request(app).get('/users/7')
                .end( (err, res) => {
                    console.log(res);
                    expect(res).to.have.status(200);
                    done();
                })

        });

        it('should return 404 if id is not found', (done) => {
            chai.request(app).get('/users/66')
                .end( (err, res) => {
                    console.log(res);
                    expect(res).to.have.status(404);
                    done();
                })

        });

        it('should return 400 if id not valid', (done) => {
            chai.request(app).get('/users/abc')
                .end( (err, res) => {
                    console.log(res);
                    expect(res).to.have.status(400);
                    done();
                })

        })
    });
});
