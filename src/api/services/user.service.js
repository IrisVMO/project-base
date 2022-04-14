const User = require('../models/user.model')
const createUser = async (email, userName, password) => {
  const user = await new User({ userName, email, password }).save()
  return user
}

const getOneUser = async (filter) => {
  const user = await User.findOne(filter)

  return user
}

const getAllUser = async () => {
  const user = await User.find()
  return user
}

const upPathfile = async (userId, link) => {
  const user = await User.findOneAndUpdate({ userId }, { linkImage: link })

  return user
}
module.exports = {
  createUser,
  getOneUser,
  getAllUser,
  upPathfile
}