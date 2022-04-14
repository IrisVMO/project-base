const express = require('express')
const morgan = require('morgan')
const APIRespone = require('./src/api/utils/APIRespone')
const APIStatus = require('./src/api/constants/APIStatus')
const userRoute = require('./src/api/routes/user.route')
const { port } = require('./src/configs/config')
const { ValidationError } = require('express-validation')

require('./src/configs/mongodb')

const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('images'))
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRoute)

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(
      APIRespone({
        status: APIStatus.FAIL,
        msg: 'validation failed',
        data: { details: err.details }
      })
    )
  }

  return res
    .status(500)
    .json(
      APIRespone({ status: APIStatus.ERROR, msg: 'Internal Server error', data: { err: err.message } })
    )
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

module.exports = app
