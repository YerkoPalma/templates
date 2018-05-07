/* global fetch */
var md = require('../lib/md')

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
    // use once because we are binding events here
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
    fetch('../assets/slides/' + slide)
      .then(response => response.text())
      .then(text => {
        var renderer = md(text)
        state.slides.content = renderer.render
        state.slides.title = renderer.meta.title
        state.slides.next = renderer.meta.next
        state.slides.prev = renderer.meta.prev
        state.slides.speech = renderer.meta.speech
        emitter.emit('render')
      })
  })
}