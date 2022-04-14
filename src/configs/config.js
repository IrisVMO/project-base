require('dotenv-safe').config()
const port = process.env.PORT
const nodeEnv = process.env.NODE_ENV
const jwtKey = process.env.JWT_KEY
const mongodbUri = process.env.NODE_ENV === 'test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI
module.exports = {
  nodeEnv,
  jwtKey,
  mongodbUri,
  port
}
