const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { jwtRefreshKey } = require('../../configs/config')
const { getOneUser } = require('../users/user.service')
const { APIResponse } = require('../../configs/config')

const decodeUserToken = async (token) => {
  try {
    const decode = jwt.verify(token, jwtRefreshKey)
    const user = await getOneUser({ _id: decode._id })

    return user
  } catch (error) {
    return null
  }
}

const authRefresh = async (req, res, next) => {
  const { refreshToken } = req.query
  if (!refreshToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(new APIResponse(false, { massage: 'Do not have permission' }))
  }

  const token = refreshToken.replace('Bearer', '')

  const user = await decodeUserToken(token)

  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new APIResponse(false, { massage: 'Invalid token' }))
  }

  req.user = user

  next()
}

module.exports = {
  authRefresh
}
