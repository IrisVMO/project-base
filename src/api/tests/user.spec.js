const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../../index')
const User = require('../models/user.model')
const APIStatus = require('../constants/APIStatus')

const expect = chai.expect

const testData = {
  user: {
    userName: 'naaaama',
    password: 'naaaam0123',
    email: 'naaaam@gmail.com'
  }
}

let token

chai.use(chaiHttp)

describe('POST /api/users/signup', () => {
  it('return status 201 and new user token', (done) => {
    chai
      .request(app)
      .post('/api/users/signup')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        userName: testData.user.userName,
        email: testData.user.email,
        password: testData.user.password
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(201)
        expect(res.body).to.have.property('status')
        expect(res.body).to.have.property('data')
        expect(res.body.status).to.equal(APIStatus.SUCCESS)
        expect(res.body.data).to.have.property('token')
        done()
      })
  })

  it('return 400 error when email is already registered', (done) => {
    chai
      .request(app)
      .post('/api/users/signup')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        userName: testData.user.userName,
        email: testData.user.email,
        password: testData.user.password
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.have.property('status')
        expect(res.body).to.have.property('msg')
        expect(res.body.status).to.equal(APIStatus.FAIL)
        done()
      })
  })
})
