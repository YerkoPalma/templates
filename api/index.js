const { send } = require('micro')
const { router, get } = require('micro-fork')

const getUsers = (req, res) => send(res, 200, {
  name: 'John',
  mail: 'john@doe.io'
})

module.exports = router()(
  get('/user', getUsers)
)
