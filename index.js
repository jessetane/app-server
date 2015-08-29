#!/usr/bin/env node

module.exports = Server

var http = require('http')
var ecstatic = require('ecstatic')

function Server (opts) {
  opts = opts || {}
  this.host = opts.host || process.env.HOST || '::'
  this.port = opts.port || process.env.PORT || '8080'
  this.share = opts.share || process.env.SHARE || 'share'

  this.statics = ecstatic(this.share, {
    cache: 'no-cache'
  })

  var self = this
  this.http = http.createServer(function (req, res) {
    self.onrequest && self.onrequest(req)
    self.statics(req, res, function () {
      req.url = '/'
      res.statusCode = 200
      self.statics(req, res)
    })
  })
}

Server.prototype.open = function (cb) {
  this.http.listen(this.port, this.host, cb)
}

Server.prototype.close = function () {
  this.http.close()
}

if (!module.parent) {
  var server = new Server()
  server.open(function (err) {
    if (err) throw err
    console.log('app server listening on ' + server.port)
  })
}
