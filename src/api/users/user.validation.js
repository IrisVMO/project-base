const { Joi } = require('express-validation')

const sigupValidation = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    username: Joi.string()
      .regex(/[a-zA-Z0-9]/)
      .max(50)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  })
}

const loginValidation = {
  body: Joi.object({
    username: Joi.string()
      .regex(/[a-zA-Z0-9]/)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  })
}

const updateValidation = {
  body: Joi.object({
    email: Joi.string()
      .email(),
    username: Joi.string()
      .regex(/[a-zA-Z0-9]/)
      .max(50),
    password: Joi.string()
      .min(6)
  })
}

module.exports = {
  sigupValidation,
  loginValidation,
  updateValidation
}
