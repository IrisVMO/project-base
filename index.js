const express = require('express')
const morgan = require('morgan')
const { errorHandler } = require('./src/api/middlewares/ErroHandler')
const { port } = require('./src/configs/config')

require('./src/configs/mongodb')

const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('images'))
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', require('./src/api/routes/user.route'))

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

module.exports = app
