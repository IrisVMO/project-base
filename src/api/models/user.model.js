const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { jwtKey } = require('../../configs/config')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },
  userName: {
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

userSchema.methods.createToken = function (){
  const user = this
  const token = jwt.sign(
    { _id: user._id },
    jwtKey,
    { expiresIn: '10days' }
  )
  return token
}

userSchema.pre('save', async function (next) {
  const user = this
  // console.log(this._id);
  user.password = await bcrypt.hash(user.password, 10)

  next()
})

module.exports = mongoose.model('User', userSchema)
