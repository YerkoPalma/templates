var choo = require('choo')
var css = require('sheetify')

css('tachyons')

var app = choo()

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
}

app.route('/', require('./views/main'))
app.route('/*', require('./views/404'))
app.mount('body')
