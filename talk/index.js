var css = require('sheetify')
var choo = require('choo')

css('tachyons')
css('highlight-syntax-pastel')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
}

app.use(require('choo-tts')())
app.use(require('./stores/mobile'))
app.use(require('./stores/offline'))
app.use(require('./stores/slides'))

app.route('/', require('./views/main'))
app.route('/*', require('./views/404'))

app.mount('body')