const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { jwtKey } = require('../../configs/config')
const { getOneUser } = require('../services/user.service')
const APIRespone = require('../utils/APIRespone')
const APIStatus = require('../constants/APIStatus')

const decodeUserToken = async (token) => {
  try {
    const decode = jwt.verify(token, jwtKey)
    const user = await getOneUser({ _id: decode._id })
    // console.log(user);
    return user
  } catch (error) {
    return null
  }
}

const auth = async (req, res, next) => {
  const originalToken = req.header('Authorization')
  if (!originalToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        APIRespone({ status: APIStatus.FAIL, msg: 'You dont have permission' })
      )
  }

  const token = originalToken.replace('Bearer ', '')
  const user = await decodeUserToken(token)
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(APIRespone({ status: APIStatus.FAIL, msg: 'Invalid token' }))
  }

  req.user = user

  next()
}

module.exports = {
  auth
}
