const { Joi } = require('express-validation')

const sigupValidation = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    userName: Joi.string()
      .regex(/[a-zA-Z0-9]/)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  })
}

const loginValidation = {
  body: Joi.object({
    userName: Joi.string()
      .regex(/[a-zA-Z0-9]/)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  })
}

module.exports = {
  sigupValidation,
  loginValidation
}