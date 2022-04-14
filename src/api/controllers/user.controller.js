const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const APIStatus = require('../constants/APIStatus')
const APIRespone = require('../utils/APIRespone')
const { createUser, getOneUser, getAllUser, upPathfile } = require('../services/user.service')
const apiRespone = require('../utils/APIRespone')

const signup = async (req, res, next) => {
  const { email, userName, password } = req.body

  const [ checkEmail, checkUserName ] = await Promise.all([getOneUser({ email }), getOneUser({ userName })])

  if(checkEmail) {
    return res.status(StatusCodes.BAD_REQUEST)
      .json(APIRespone({ status: APIStatus.FAIL, msg: 'Email is existed'}))
  }
  if(checkUserName) {
    return res.status(StatusCodes.BAD_REQUEST)
      .join(apiRespone({status: APIStatus.FAIL, msg: 'Username is existed'}))
  }

  const user = await createUser(email, userName, password)
  const token = user.createToken()

  res.status(StatusCodes.CREATED)
    .json(APIRespone({
      status: APIStatus.SUCCESS,
      msg: 'Signup is successfully',
      data: { token }
    }))
}

const login = async (req, res, next) => {
  const { userName, password } = req.body
  const user = await getOneUser({ userName })

  if (!user) {
    res.status(StatusCodes.BAD_REQUEST)
      .json(APIRespone({ status: APIStatus.FAIL }))
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = user.createToken()

      res.status(StatusCodes.OK)
        .json(APIRespone({
          status: APIRespone.SUCCESS,
          msg: 'Login is successfully',
          data: { token }
        }))
    } else if (!err) {
      res.status(StatusCodes.BAD_REQUEST)
        .json(APIRespone({
          status: APIStatus.FAIL,
          msg: 'Username or password wrong'
        }))
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(APIRespone({
          status: APIStatus.ERROR,
          msg: 'Internal server error'
        })
        )
    }
  })
}

const getInf = async (req, res, next) => {
  res.status(StatusCodes.OK)
    .json(APIRespone({
      status: APIStatus.SUCCESS,
      data: { info: req.user }
    }))
}

const getAll = async (req, res, next) => {
  const rs = await getAllUser()

  res.status(StatusCodes.OK)
    .json(APIRespone({
      status: APIStatus.SUCCESS,
      data: { Users: rs }
    }))
}

const getAvatar = async (req, res, next) => {
  const { _id: userId } = req.user
  const user = await getOneUser({ userId })
  const link = user.pathFileAvatar

  res.status(StatusCodes.OK)
    .json(APIRespone({
      status: APIStatus.SUCCESS,
      data: { link }
    }))
}

const upAvatar = async (req, res, next) => {
  const { _id: userId } = req.user
  const link = path.join('../../../images', req.file.originalname)

  const rs = await upPathfile(userId, link)

  res.status(StatusCodes.OK)
    .json(APIRespone({
      status: APIStatus.SUCCESS,
      msg: 'Upload avatar successfully',
      data: rs
    }))
}

module.exports = {
  signup,
  login,
  getInf,
  getAll,
  upAvatar,
  getAvatar
}
