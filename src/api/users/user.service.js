const User = require('./user.model')
const createUser = async (email, username, password) => {
  const user = await new User({ username, email, password }).save()
  return user
}

const getOneUser = async (filter) => {
  const user = await User.findOne(filter)
  return user
}

const getAllUser = async (query) => {
  const { page, records, filter } = query
  const [totalRecords, users] = await Promise.all([User.find(filter).count(),
    User.find(filter, { _id: false, password: false })
      .skip((page - 1) * records)
      .limit(records)
  ])

  return {
    users,
    totalRecords
  }
}

const updateInforService = async (email, username, userId) => {
  const user = await User.findByIdAndUpdate(userId, { email: email, username: username })
  return user
}

const upPathfile = async (userId, link) => {
  const user = await User.findOneAndUpdate({ userId }, { linkImage: link })
  return user
}
const logoutService = async (user, currentToken) => {
  user.tokens = user.tokens.filter(({ token }) => token !== currentToken)
  await user.save()
}

const deleteUserService = async (userId) => {
  const user = await User.findByIdAndDelete(userId)
  return user
}
module.exports = {
  createUser,
  getOneUser,
  getAllUser,
  updateInforService,
  upPathfile,
  logoutService,
  deleteUserService
}
