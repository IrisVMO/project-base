const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcrypt')
const path = require('path')
const APIError = require('../errors/APIError')
const transporter = require('../Helpers/email')
const { APIResponse, emailHelper, pagination } = require('../../configs/config')
const { createUser, getOneUser, getAllUser, updateInforService, upPathfile, deleteUserService, logoutService } = require('./user.service')

const signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body
    const [emailIsExisted, usernameIsExisted] = await Promise.all([
      getOneUser({ email }),
      getOneUser({ username })
    ])
    if (emailIsExisted) {
      throw new APIError(StatusCodes.CONFLICT, 'Email already exists')
    }
    if (usernameIsExisted) {
      throw new APIError(StatusCodes.CONFLICT, 'Username already exists')
    }

    const user = await createUser(email, username, password)
    const token = user.createToken()

    const options = {
      from: emailHelper,
      to: email,
      subject: 'Wellcom to project-base',
      // accessToken: token,
      text: 'Active email'
    }

    transporter.sendMail(options)

    res.json(new APIResponse(true, { token }))
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await getOneUser({ username })
    if (!user) {
      throw new APIError(StatusCodes.BAD_REQUEST, 'Username or password wrong')
    }

    const result = bcrypt.compareSync(password, user.password)
    if (result) {
      const token = user.createToken()
      res.json(new APIResponse(true, { msg: 'Login is successfully', token }))
    } else {
      throw new APIError(StatusCodes.BAD_REQUEST, 'username or password wrong')
    }
  } catch (error) {
    next(error)
  }
}

const getInf = (req, res) => {
  res.json(new APIResponse(true, { infor: req.user }))
}

const getAll = async (req, res, next) => {
  try {
    const { page, ...filter } = req.query
    const query = {
      page: page || pagination.page,
      records: pagination.records,
      filter
    }

    const rs = await getAllUser(query)

    res.json(new APIResponse(true, rs))
  } catch (error) {
    next(error)
  }
}

const updateInfor = async (req, res, next) => {
  try {
    const { _id: userId } = req.user
    const { email, username } = req.body

    const [emailIsExisted, usernameIsExisted] = await Promise.all([
      getOneUser({ email }),
      getOneUser({ username })
    ])
    if (emailIsExisted) {
      throw new APIError(StatusCodes.CONFLICT, 'Email already exists')
    }
    if (usernameIsExisted) {
      throw new APIError(StatusCodes.CONFLICT, 'Username already exists')
    }

    const rs = await updateInforService(email, username, userId)

    res.json(new APIResponse(true, rs))
  } catch (error) {
    next(error)
  }
}

const upAvatar = async (req, res, next) => {
  try {
    const { _id: userId } = req.user
    const link = path.join('../../../images', req.file.originalname)

    const rs = await upPathfile(userId, link)

    res.json(new APIResponse(true, rs))
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    await logoutService(req.user, req.token)
    res.json(new APIResponse(true, {}))
  } catch (error) {
    next(error)
  }
}

const deleteOneUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user
    const rs = await deleteUserService(userId)

    res.json(new APIResponse(true, rs))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signup,
  login,
  getInf,
  getAll,
  upAvatar,
  updateInfor,
  logout,
  deleteOneUser
}
