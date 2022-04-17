const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcrypt')
const path = require('path')
const CustomError = require('../errors/customError')
const errorCode = require('../errors/errorCode')
const { ResponseResult } = require('../../configs/config')
const { createUser, getOneUser, getAllUser, upPathfile } = require('../services/user.service')

const signup = async (req, res) => {
  const { email, userName, password } = req.body

  const [checkEmail, checkUserName] = await Promise.all([
    getOneUser({ email }),
    getOneUser({ userName })
  ])

  if (checkEmail) {
    throw new CustomError(errorCode.CONFLICT, 'Email đã tồn tại')
  }
  if (checkUserName) {
    throw new CustomError(errorCode.CONFLICT, 'Username đã tồn tại')
  }

  const user = await createUser(email, userName, password)
  const token = user.createToken()

  res.status(StatusCodes.CREATED)
    .json(new ResponseResult(true, { user, token }))
}

const login = async (req, res, next) => {
  const { userName, password } = req.body
  const user = await getOneUser({ userName })

  if (!user) {
    throw new Error('');
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = user.createToken()

      res.status(StatusCodes.OK)
        .json({ msg: 'Đăng nhập thành công', data: { token } })
    } else if (!err) {
      res.status(StatusCodes.BAD_REQUEST)
        .json('Username hoặc mật khẩu sai')
    }
  })
}

const getInf = async (req, res, next) => {
  res.status(StatusCodes.OK)
    .json(req.user)
}

const getAll = async (req, res, next) => {
  const rs = await getAllUser()

  res.status(StatusCodes.OK)
    .json(rs)
}

const getAvatar = async (req, res, next) => {
  const { _id: userId } = req.user
  const user = await getOneUser({ userId })
  const link = user.pathFileAvatar

  res.status(StatusCodes.OK)
    .json(link)
}

const upAvatar = async (req, res, next) => {
  const { _id: userId } = req.user
  const link = path.join('../../../images', req.file.originalname)

  const rs = await upPathfile(userId, link)

  res.status(StatusCodes.OK)
    .json(rs)
}

module.exports = {
  signup,
  login,
  getInf,
  getAll,
  upAvatar,
  getAvatar
}
