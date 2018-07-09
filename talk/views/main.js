var html = require('choo/html')
var raw = require('choo/html/raw')

module.exports = view

function view (state, emit) {
  if (!state.slides || !state.slides.content) {
    emit('slides:load', 'intro.md')
  }
  return html`
    <body class="overflow-hidden cf center bg-washed-red code pa4">
      ${state.slides.content ? 
      raw(state.slides.content
        .replace(/<pre/g, '<pre class=\"near-white bg-mid-gray overflow-x-visible-ns overflow-x-scroll pa3\"')
        .replace(/<img /g, '<img class=\"mw-100 w-50-ns w-100 db center\"')
        .replace(/<a /g, '<a class=\"link pointer bb b--dashed bt-0 bl-0 br-0 bw2 bg-animate hover-bg-light-red b--light-red black\" ')
        .replace(/<p>/g, '<p class=\"f4 f2-ns lh-copy georgia mv0\">')
        .replace(/<blockquote>/g, '<blockquote class=\"i pl4 bl bw1 b--light-red mb4\">')
        .replace(/<h(\d)>/g, '<h$1 class=\"f$1 georgia\">')
        .replace(/<li>/g, '<li class=\"f4 f2-ns lh-copy georgia\">')
      ) : 
      html`<h2>Loading...</h2>`}
    </body>
  `
}