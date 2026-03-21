# app-server
Static file HTTP server for SPAs.

## Why
When serving JavaScript applications, it's convenient to have an http server that will serve static files if they exist, but fall back to serving index.html if they don't.

## How
[ecstatic](https://github.com/jfhbrook/node-ecstatic)

## Example
As a standalone executable:
```bash
$ app-server --port 3000 --spa /about,/settings
```

Use env vars to change the default host / port / root directory:
```bash
$ HOST='::' PORT=8080 ROOT=public app-server
```

As a JavaScript library:
```javascript
import createServer from 'app-server'

// env vars are respected, but you can override them:
const server = createServer({
  host: '::',
  port: 8080,
  root: 'public',
  spa: ['/about', '/settings']
})

// get a callback after the server starts
const server = createServer(function (err) {
  if (err) throw err
  console.log(`app server listening on ${server.port}`)
})

// optionally attach connect-style middleware
server.middleware = (req, res, next) => {
  next()
}
```

## CLI Arguments
* `--host`, `-h`: hostname or IP to listen on (default `::`)
* `--port`, `-p`: port to listen on (default `8080`)
* `--root`, `-r`: root directory to serve from (default `public`)
* `--spa`: comma-separated list of routes that should always fallback to index.html

## Install
```bash
$ npm install jessetane/app-server
```

## Changes
* 5.0.0
  * Move to ES modules
  * Use native fetch for tests
  * Add support for `--spa` routes to handle directory collisions
  * Add CLI flag parsing
* 3.0.0
  * Change default root directory to "public"
* 2.0.0
  * Don't export a class, make connect compatible.

## Test
```bash
$ npm run test
```

## License
MIT
