var createServer = require('../')
var request = require('hyperquest')
var fs = require('fs')

var expected = fs.readFileSync('test/fixture/index.html', 'utf8')

var server = createServer({
  port: '7357',
  root: 'test/fixture'
}, function (err) {
  if (err) throw err
  if (server.port !== '7357') throw new Error('ports do not match')

  dorequest('http://localhost:7357', function (err, res) {
    if (err) throw err
    if (res !== expected) {
      throw new Error('response did not equal expected value')
    }

    dorequest('http://localhost:7357/test.txt', function (err, res) {
      if (err) throw err
      if (res !== '-') {
        throw new Error('response did not equal expected value')
      }

      dorequest('http://localhost:7357/bogus.html', function (err, res) {
        if (err) throw err
        if (res !== expected) {
          throw new Error('response did not equal expected value')
        }

        console.log('all tests pass')
        server.close()
      })
    })
  })
})

function dorequest (url, cb) {
  var res = ''
  request(url)
    .on('data', function (data) {
      res += data.toString()
    })
    .on('error', function (err) {
      cb(err)
    })
    .on('end', function () {
      cb(null, res)
    })
}
