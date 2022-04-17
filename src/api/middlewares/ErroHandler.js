const snakecaseKeys = require('snakecase-keys')
const errorCodes = require('../errors/errorCode')
const getErrorMessage = require('../errors/message')
const { ResponseResult } = require('../../configs/config')

function errorHandler(err, req, res, next) {
  let errorCode = err.code
  let { message } = err
  const code = err.code || errorCodes.INTERNAL_SERVER_ERROR
  switch (code) {
    case errorCodes.BAD_REQUEST:
      message = message || 'Bad Request'
      break
    case errorCodes.UNAUTHORIZED:
      message = message || 'Unauthorized'
      break
    case errorCodes.FORBIDDEN:
      message = message || 'Forbidden'
      break
    case errorCodes.NOT_FOUND:
      message = message || 'Not Found'
      break
    case errorCodes.CONFLICT:
      errorCode = errorCodes.CONFLICT
      message = message || 'Conflict resources'
      break
    case errorCodes.INTERNAL_SERVER_ERROR:
      errorCode = errorCodes.INTERNAL_SERVER_ERROR
      message = message || 'Something went wrong'
      break
    default:
      message = message || getErrorMessage(code)
      errorCode = 200
  }
  return res.status(errorCode).send(
    snakecaseKeys(
      code
        ? new ResponseResult(false, { code, message })
        : new ResponseResult(false, { message })
    )
  )
}

module.exports = { errorHandler }
