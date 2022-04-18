const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../../index')
const User = require('../models/user.model')

const expect = chai.expect

const testData = {
  user: {
    userName: 'awer',
    password: 'naaaam0123',
    email: 'abcs@gmail.com'
  }
}

let token

chai.use(chaiHttp)

describe('POST /api/users/signup', () => {
  it('return status 200 and new user token', (done) => {
    chai
      .request(app)
      .post('/api/users/signup')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        email: testData.user.email,
        userName: testData.user.userName,
        password: testData.user.password
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('success')
        expect(res.body).to.have.property('data')
        expect(res.body.success).to.equal(true)
        expect(res.body.data).to.have.property('token')
        done()
      })
  })

  it('return 409 error when email is already registered', (done) => {
    chai
      .request(app)
      .post('/api/users/signup')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        email: testData.user.email,
        userName: testData.user.userName,
        password: testData.user.password
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(409)
        expect(res.body).to.have.property('success')
        expect(res.body.data).to.have.property('message')
        expect(res.body.success).to.equal(false)
        done()
      })
  })
})

describe('POST /api/users/login', () => {
  it('return user token', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        userName: testData.user.userName,
        password: testData.user.password
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('success')
        expect(res.body).to.have.property('data')
        expect(res.body.success).to.equal(true)
        expect(res.body.data).to.have.property('token')
        token = res.body.data.token
        done()
      })
  })

  it('return 400 error when userName or password wrong', (done) => {
    chai
      .request(app)
      .post('/api/users/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        userName: testData.user.userName,
        password: testData.user.password + 'haha'
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.have.property('success')
        expect(res.body.success).to.equal(false)
        expect(res.body.data).to.have.property('message')
        done()
      })
  })
})

describe('GET /api/users/info', () => {
  after(async () => {
    await User.deleteMany({})
  })

  it('return user info: username and email', (done) => {
    chai
      .request(app)
      .get('/api/users/infor')
      .set({ Authorization: token })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('success')
        expect(res.body).to.have.property('data')
        expect(res.body.success).to.equal(true)
        expect(res.body.data).to.have.property('infor')
        expect(res.body.data.infor).to.have.property('userName')
        expect(res.body.data.infor).to.have.property('email')
        expect(res.body.data.infor.userName).to.equal(testData.user.userName)
        expect(res.body.data.infor.email).to.equal(testData.user.email)
        done()
      })
  })
  it('return 400 error when token is not valid', (done) => {
    chai
      .request(app)
      .get('/api/users/infor')
      .set({ Authorization: 'random' })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.have.property('success')
        expect(res.body.data).to.have.property('massage')
        expect(res.body.success).to.equal(false)
        done()
      })
  })
})
