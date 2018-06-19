var html = require('choo/html')

var TITLE = 'welcome - main'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy">
      <main class="pa3 cf center w3">
          <h2>I</h2>
          <p>Hello</p>
      </main>
    </body>
  `
}
