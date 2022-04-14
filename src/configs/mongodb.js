const mongoose = require('mongoose')

const { mongodbUri } = require('./config')

mongoose.connect(mongodbUri).catch((error) => console.log(error.message))

mongoose.connection.on('error', (error) => {
  console.log('Mongodb connection error')
  console.log(JSON.stringify(error))
})

mongoose.connection.once('open', () => {
  console.log('Mongodb connection successfully')
})