var html = require('choo/html')

module.exports = view

function view (state, emit) {
  if (!state.slides || !state.slides.content) {
    emit('slides:load', 'intro.md')
  }
  return html`
    <body class="overflow-hidden cf center bg-washed-red code pa4">
      ${state.slides.content || html`<h2>Loading...</h2>`}
    </body>
  `
}