var Router = require('singleton-router')
var sf = require('sheetify')
var html = require('bel')

sf('tachyons', { global: true })
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
