#!/usr/bin/env node

import fs from 'fs'
import http from 'http'
import ecstatic from 'ecstatic'

export default function createServer (opts = {}) {
  const spaRoutes = opts.spa || []
  const server = http.createServer((req, res) => {
    if (server.middleware) {
      server.middleware(req, res, err => {
        if (err) {
          res.statusCode = err.code || 500
          return res.end(err.message)
        }
        tryFiles(req, res)
      })
    } else {
      tryFiles(req, res)
    }
  })
  function tryFiles (req, res) {
    const pathname = req.url.split('?')[0]
    if (spaRoutes.includes(pathname)) {
      req.url = '/'
      res.statusCode = 200
      return statics(req, res)
    }
    statics(req, res, () => {
      req.url = '/'
      res.statusCode = 200
      statics(req, res)
    })
  }
  server.host = opts.host || process.env.HOST || '::'
  server.port = opts.port || process.env.PORT || '8080'
  server.root = opts.root || process.env.ROOT || 'public'
  server.listen(server.port, server.host)
  const statics = ecstatic(server.root, {
    cache: 'no-cache',
    mime: {
      'application/javascript': ['js', 'mjs']
    }
  })
  return server
}

if (import.meta.main) {
  const args = process.argv.slice(2)
  const opts = { spa: [] }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--host' || arg === '-h') {
      opts.host = args[++i]
    } else if (arg === '--port' || arg === '-p') {
      opts.port = args[++i]
    } else if (arg === '--root' || arg === '-r') {
      opts.root = args[++i]
    } else if (arg === '--spa' || arg === '-s') {
      opts.spa = args[++i].split(',')
    }
  }
  const server = createServer(opts, err => {
    if (err) throw err
    console.log(`app server listening on ${server.port}`)
  })
}
