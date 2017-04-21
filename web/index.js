var Router = require('singleton-router')
var html = require('bel')

var router = Router()

router.addRoute('/', mainView)
router.notFound(notFoundView)
router.setRoot('/')
router.start()

function mainView (params, state) {
  return html`<main>
    <h1>Hello world!</h1>
  </main>`
}

function notFoundView (params, state) {
  return html`<main>
    <h1>ups! nothing here :(</h1>
  </main>`
}
