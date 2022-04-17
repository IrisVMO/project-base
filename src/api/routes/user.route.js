const express = require('express')
const asynWrap = require('../middlewares/asynWrap')
const { validate } = require('express-validation')
const { auth } = require('../middlewares/auth')
const { uploadSingle } = require('../middlewares/uploadFile')
const { sigupValidation, loginValidation } = require('../validation/user.validation')
const { signup, login, getInf, getAll, upAvatar } = require('../controllers/user.controller')

const routes = express.Router()

routes.get('/infor', auth, asynWrap(getInf))
routes.get('/alluser',auth, asynWrap(getAll))
routes.post('/signup', validate(sigupValidation), asynWrap(signup))
routes.post('/login', validate(loginValidation), login)
routes.post('/avatar', auth, uploadSingle, upAvatar)

module.exports = routes
