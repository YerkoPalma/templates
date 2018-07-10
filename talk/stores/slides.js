/* global fetch */
var MarkdownIt = require('markdown-it')
var Highlight = require('highlight-syntax')
var highlight = Highlight([ require('highlight-syntax/js') ])
var md = MarkdownIt('default', {
  html: true,
  highlight: function (str, lang) {
    if (lang) {
      try {
        return highlight(str, { lang: lang })
      } catch (__) {}
    }

    return ''
  }
})

md.use(require('markdown-it-meta'))
md.use(require('markdown-it-emoji'))

module.exports = store

var events = store.events = {
  NEXT: 'slides:next',
  PREV: 'slides:prev',
  SPEAK: 'slides:speak',
  LOAD: 'slides:load'
}
function store (state, emitter) {
  state.slides = {
    current: 0,
    title: '',
    next: '',
    prev: ''
  }

  emitter.on('DOMContentLoaded', function () {
    window.addEventListener('keydown', function (event) {
      if (event.key === ' ' || event.key === 'ArrowRight') {
        emitter.emit(events.NEXT)
      } else if (event.key === 'ArrowLeft') {
        emitter.emit(events.PREV)
      } else if (event.key === 'F1') {
        emitter.emit(events.SPEAK)
      }
    })
    // also add support for mobile handlers
    emitter.on('tap', () => emitter.emit(events.NEXT))
    emitter.on('doubletap', () => emitter.emit(events.PREV))
    emitter.on('hold', () => emitter.emit(events.SPEAK))
  })
  emitter.on(events.NEXT, function () {
    if (state.slides.next !== '.') {
      state.slides.current++
      emitter.emit(events.LOAD, state.slides.next)
    }
  })
  emitter.on(events.PREV, function () {
    if (state.slides.prev !== '.') {
      state.slides.current--
      emitter.emit(events.LOAD, state.slides.prev)
    }
  })
  emitter.on(events.SPEAK, function () {
    var { audio, lang } = state.slides.speech
    var voice = state.tts.voices.filter(voice => voice.lang === lang)[0]
    if (voice) state.tts.selectedVoice = voice
    emitter.emit('tts:speak', audio)
  })
  emitter.on(events.LOAD, function (slide) {
    fetch('../content/' + slide)
      .then(response => response.text())
      .then(text => {
        state.slides.content = md.render(text)
        state.slides.title = md.meta.title
        state.slides.next = md.meta.next
        state.slides.prev = md.meta.prev
        state.slides.speech = md.meta.speech
        emitter.emit(state.events.DOMTITLECHANGE, state.slides.title)
        emitter.emit('render')
      })
  })
}