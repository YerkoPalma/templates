var html = require('choo/html')
var Button = require('../components/button')

var TITLE = 'welcome - main'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy">
      <main class="pa3 cf center tc w5">
          <h2>${state.components.button ? state.components.button.count : '0'}</h2>
          ${state.cache(Button, 'button', 'Hello world').render(state, emit)}
      </main>
    </body>
  `
}
