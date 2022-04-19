const snakecaseKeys = require('snakecase-keys')
const { StatusCodes } = require('http-status-codes')
const { APIResponse } = require('../../configs/config')
const { ValidationError } = require('express-validation')

function errorHandler(err, req, res, next) {
  const code = err.statusCode || err.code || StatusCodes.INTERNAL_SERVER_ERROR
  let errorCode = err.code
  let { message } = err

  if (err instanceof ValidationError) {
    const { message } = err.details.body[0]
    return res.status(code).json(new APIResponse(false, { code, message }))
  } else {
    switch (code) {
      case StatusCodes.BAD_REQUEST:
        message = message
        break
      case StatusCodes.UNAUTHORIZED:
        message = message
        break
      case StatusCodes.FORBIDDEN:
        message = message
        break
      case StatusCodes.NOT_FOUND:
        message = message
        break
      case StatusCodes.CONFLICT:
        errorCode = StatusCodes.CONFLICT
        message = message
        break
      case StatusCodes.INTERNAL_SERVER_ERROR:
        errorCode = StatusCodes.INTERNAL_SERVER_ERROR
        message = message || 'Something went wrong'
        break
      default:
        message = message
        errorCode = 200
    }
    return res.status(errorCode).json(
      snakecaseKeys(
        code
          ? new APIResponse(false, { code, message })
          : new APIResponse(false, { message })
      )
    )
  }
}

module.exports = { errorHandler }
