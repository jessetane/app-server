#!/usr/bin/env node

module.exports = createServer

var http = require('http')
var ecstatic = require('ecstatic')

function createServer (opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  var server = http.createServer(function (req, res) {
    server.middleware && server.middleware(req, res, function (err) {
      if (err) {
        res.statusCode = err.code || 500
        return res.end(err.message)
      }

      statics(req, res, function () {
        req.url = '/'
        res.statusCode = 200
        statics(req, res)
      })
    })
  })

  server.host = opts.host || process.env.HOST || '::'
  server.port = opts.port || process.env.PORT || '8080'
  server.share = opts.share || process.env.SHARE || 'share'
  server.listen(server.port, server.host, cb)

  var statics = ecstatic(server.share, {
    cache: 'no-cache'
  })

  return server
}

if (!module.parent) {
  var server = createServer(function (err) {
    if (err) throw err
    console.log('app server listening on ' + server.port)
  })
}
