require('dotenv-safe').config()

const port = process.env.PORT
const jwtKey = process.env.JWT_KEY
const mongodbUri = process.env.NODE_ENV === 'test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI
const emailHelper = process.env.EMAIL
const password = process.env.PASSWORD

const APIResponse = class {
  constructor (success = true, data = {}) {
    this.success = success
    this.data = data
  }
}

module.exports = {
  pagination: {
    page: 1,
    records: 20
  },
  jwtKey,
  mongodbUri,
  port,
  emailHelper,
  password,
  APIResponse
}
