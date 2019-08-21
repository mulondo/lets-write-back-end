const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index')
chai.use(chaiHttp);
chai.should();
const signupURL = '/api/auth/register'

describe('test for registration', () => {
  it('sign up test', (done) => {
    chai.request(app)
      .post(signupURL)
      .send({ name: 'moses', email: 'moses@gmail.com', password: '123455' })
      .end((err, res) => {
        res.should.have.status(200)
        res.should.have.be.a('object')
      })
    done()
  })

  it('test for registration with wrong email format', (done) => {
    chai.request(app)
      .post(signupURL)
      .send({ name: 'moses', email: 'moses@gmail', password: '123455' })
      .end((err, res) => {
        res.body.email.should.equal('Email is invalid')
        done()
      })
  })

  it('test for registration with missing email format', (done) => {
    chai.request(app)
      .post(signupURL)
      .send({ name: 'moses', email: '', password: '123455' })
      .end((err, res) => {
        res.body.email.should.equal('Email is required')
        done()
      })
  })

  it('test for registration with missing name', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ name: '', email: 'moses@gmail.com', password: '123455' })
      .end((err, res) => {
        res.body.name.should.equal('name is required')
        done()
      })
  })

  it('test for registration with missing password', (done) => {
    chai.request(app)
    .post(signupURL)
    .send({name: 'moses', email: 'moses@gmail.com', password: ''})
    .end((err, res) => {
      res.body.password.should.equal('Password is required')
      done()
    })
  })
})
