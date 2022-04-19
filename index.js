const express = require('express')
const morgan = require('morgan')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerOptions = require('./src/configs/swagger')
const { errorHandler } = require('./src/api/middlewares/ErroHandler')
const { port } = require('./src/configs/config')

require('./src/configs/mongodb')

const app = express()
const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('images'))
app.use(express.urlencoded({ extended: true }))
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use('/api/users', require('./src/api/users/user.route'))

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

module.exports = app
