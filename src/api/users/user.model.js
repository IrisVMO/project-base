const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { jwtAccessKey, jwtRefreshKey } = require('../../configs/config')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },
  username: {
    type: String,
    trim: true,
    maxlength: 50,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  linkImage: {
    type: String,
    trim: true,
    require: true
  }
},
  {
    timestamps: true
  }
)

userSchema.methods.createToken = function () {
  const user = this
  const accessToken = jwt.sign({ _id: user._id }, jwtAccessKey, { expiresIn: '10days' })
  const refreshToken = jwt.sign({ _id: user._id }, jwtRefreshKey, { expiresIn: '10days' })
  return { accessToken, refreshToken }
}

userSchema.pre('save', async function (next) {
  const user = this
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  next()
})

module.exports = mongoose.model('User', userSchema)
