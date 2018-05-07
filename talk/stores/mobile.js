var Hammer = require('hammerjs')
module.exports = mobile

function mobile (state, emitter) {
  var body = document.body

  var manager = new Hammer.Manager(body)
  // Tap recognizer with minimal 2 taps
  manager.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }))
  // Single tap recognizer
  manager.add(new Hammer.Tap({ event: 'singletap' }))
  // Hold recognizer
  manager.add(new Hammer.Press({ time: 500 }))

  // we want to recognize this simulatenous, so a quadrupletap will be detected
  // even while a tap has been recognized.
  manager.get('doubletap').recognizeWith('singletap')
  manager.get('press').recognizeWith('singletap')
  // we only want to trigger a tap, when we don't have detected a doubletap
  manager.get('singletap').requireFailure(['doubletap', 'press'])

  manager.on('singletap', event => emitter.emit('tap'))
  manager.on('doubletap', event => emitter.emit('doubletap'))
  manager.on('press', event => emitter.emit('hold'))
}