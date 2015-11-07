# app-server
Personal flavor of static file http server

## Why
When serving JavaScript applications, it's convenient to have an http server that will serve static files if they exist, but fall back to serving index.html if they don't.

## How
[ecstatic](https://github.com/jfhbrook/node-ecstatic)

## Example
As a standalone executable:
```bash
$ app-server
```

Use env vars to change the default host / port / shared directory:
```bash
$ HOST='::' PORT=8080 SHARE=share app-server
```

As a JavaScript library:
```javascript
var createServer = require('app-server')

// env vars are respected, but you can override them:
var server = createServer({
  host: '::',
  port: 8080,
  share: 'share'
})

// get a callback after the server starts
var server = createServer(function (err) {
  if (err) throw err
  console.log('app server listening on ' + server.port)
})
```

## Install
```bash
$ npm install jessetane/app-server#2.0.0
```

## Changes
* 2.0.0
  * Don't export a class, make connect compatible.

## Test
```bash
$ npm run test
```

## License
WTFPL
