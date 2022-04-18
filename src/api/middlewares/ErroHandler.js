const snakecaseKeys = require('snakecase-keys')
const { StatusCodes } = require('http-status-codes')
const { ResponseResult } = require('../../configs/config')
const { ValidationError } = require('express-validation')

function errorHandler(err, req, res, next) {
  const code = err.statusCode || err.code || StatusCodes.INTERNAL_SERVER_ERROR
  let errorCode = err.code
  let { message } = err
  
  if (err instanceof ValidationError) {
    message = err.details.body[0].message
    return res.status(code).json(new ResponseResult(false, { code, message }))
  } else {
    switch (code) {
      case StatusCodes.BAD_REQUEST:
        message = message || 'Bad Request'
        break
      case StatusCodes.UNAUTHORIZED:
        message = message || 'Unauthorized'
        break
      case StatusCodes.FORBIDDEN:
        message = message || 'Forbidden'
        break
      case StatusCodes.NOT_FOUND:
        message = message || 'Not Found'
        break
      case StatusCodes.CONFLICT:
        errorCode = StatusCodes.CONFLICT
        message = message || 'Conflict resources'
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
          ? new ResponseResult(false, { code, message })
          : new ResponseResult(false, { message })
      )
    )
  }
}

module.exports = { errorHandler }
