const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcrypt')
const path = require('path')
const CustomError = require('../errors/customError')
const transporter = require('../Helpers/email')
const { ResponseResult, emailHelper } = require('../../configs/config')
const { createUser, getOneUser, getAllUser, upPathfile } = require('../services/user.service')

const signup = async (req, res) => {
  const { email, userName, password } = req.body

  const [emailIsExisted, userNameIsExisted] = await Promise.all([
    getOneUser({ email }),
    getOneUser({ userName })
  ])
  if (emailIsExisted) {
    throw new CustomError(StatusCodes.CONFLICT, 'Email already exists')
  }
  if (userNameIsExisted) {
    throw new CustomError(StatusCodes.CONFLICT, 'Username already exists')
  }

  const user = await createUser(email, userName, password)
  const token = user.createToken()

  const options = {
    from: emailHelper,
    to: email,
    subject: 'Wellcom to project-base',
    accessToken: token,
    text: 'Active email'
  }

  transporter.sendMail(options)

  res.json(new ResponseResult(true, { user, token }))
}

const login = async (req, res) => {
  const { userName, password } = req.body

  const user = await getOneUser({ userName })
  if (!user) {
    throw new CustomError(StatusCodes.BAD_REQUEST, 'Username or password wrong')
  }

  const result = bcrypt.compareSync(password, user.password)
  if (result) {
    const token = user.createToken()
    res.json(new ResponseResult(true, { msg: 'Login is successfully', token }))
  } else {
    throw new CustomError(StatusCodes.BAD_REQUEST, 'Username or password wrong')
  }
}

const getInf = async (req, res) => {
  res.json(new ResponseResult(true, { infor: req.user }))
}

const getAll = async (req, res) => {
  const rs = await getAllUser()

  res.json(new ResponseResult(true, rs))
}

const upAvatar = async (req, res) => {
  const { _id: userId } = req.user
  const link = path.join('../../../images', req.file.originalname)
  const rs = await upPathfile(userId, link)
  res.json(new ResponseResult(true, rs))
}

module.exports = {
  signup,
  login,
  getInf,
  getAll,
  upAvatar
}
