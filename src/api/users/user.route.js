const express = require('express')
const { validate } = require('express-validation')
const { auth } = require('../middlewares/auth')
const { authRefresh } = require('../middlewares/auth.controller')
const { uploadSingle } = require('../middlewares/uploadFile')
const { sigupValidation, loginValidation, updateValidation } = require('./user.validation')
const { 
  signup,
  login,
  refreshNewToken,
  getInf,
  getAll,
  upAvatar,
  updateInfor,
  deleteOneUser
} = require('./user.controller')

const routes = express.Router()

routes.get('/infor', auth, getInf)

routes.get('/alluser', auth, getAll)

routes.get('/refreshtoken', authRefresh , refreshNewToken)

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Create new user
 *     tags:
 *       - User
 *     parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        description: Created user object
 *     responses:
 *       200:
 *         description: User Added Successfully.
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Conflict
 */


routes.post('/signup', validate(sigupValidation), signup)

routes.post('/login', validate(loginValidation), login)

routes.patch('/update', auth, validate(updateValidation), updateInfor)

routes.patch('/avatar', auth, uploadSingle, upAvatar)

routes.delete('/delete', auth, deleteOneUser)

module.exports = routes
