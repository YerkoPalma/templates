const { router, get, post } = require('micro-fork')
const { getUsers, createUsers } = require('./routes/user')

module.exports = router()(
  get('/user', getUsers),
  post('/user', createUsers)
)
