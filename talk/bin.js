#! /usr/bin/env node

process.title = 'mtalk'

var minimist = require('minimist')
var assert = require('assert')
var rimraf = require('rimraf')
var Dat = require('dat-node')
var { createServer } = require('http')
var bankai = require('bankai/http')
var { resolve, join } = require('path')
var { spawn } = require('child_process')
var argv = minimist(process.argv.slice(2), {alias: {dev: 'd'}, boolean: 'dev'})

;(function (argv) {
  var dist = resolve(process.cwd(), 'dist')

  if (argv.dev) {
    var compiler = bankai(join(__dirname, 'index.js'), { quiet: true })
    var server = createServer(function (req, res) {
      compiler(req, res, function () {
        res.statusCode = 404
        res.end('not found')
      })
    })

    server.listen(8080, '0.0.0.0', function () {
      console.log('listening on port 8080')
    })
  } else {
    // build and generate
    var bankaiProcess = spawn(resolve('node_modules', '.bin', 'bankai'), ['build', resolve(__dirname, 'index.js'), dist])
    bankaiProcess.on('exit', (code, signal) => {
      rimraf(resolve(__dirname, 'assets', 'slides/*.md'), () => {
        // share on dat
        Dat(dist, (err, dat) => {
          assert.ifError(err)
          var network = dat.joinNetwork()
          network.once('connection', function () {
            console.log('Connected')
          })
          dat.importFiles(dist)
          console.log(`Sharing: ${dat.key.toString('hex')}\n`)
        })
      })
    })
    bankaiProcess.stderr.on('data', data => {
      console.log(data)
    })
  }
})(argv)