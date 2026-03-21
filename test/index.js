import fs from 'fs'
import createServer from '../index.js'

const expected = fs.readFileSync('test/fixture/index.html', 'utf8')

const server = createServer({
  port: '7357',
  root: 'test/fixture',
  spa: ['/spa']
})

try {
  let res = await fetch('http://localhost:7357')
  let text = await res.text()
  if (text !== expected) throw new Error('response did not equal expected value')

  res = await fetch('http://localhost:7357/test.txt')
  text = await res.text()
  if (text !== '-') throw new Error('response did not equal expected value')

  res = await fetch('http://localhost:7357/bogus.html')
  text = await res.text()
  if (text !== expected) throw new Error('response did not equal expected value')

  res = await fetch('http://localhost:7357/spa', { redirect: 'manual' })
  text = await res.text()
  if (res.status !== 200 || text !== expected) throw new Error('response for /spa did not equal expected SPA index value')

  res = await fetch('http://localhost:7357/spa/', { redirect: 'manual' })
  text = await res.text()
  if (res.status !== 200 || text !== expected) throw new Error('response for /spa/ did not equal expected SPA index value')

  console.log('all tests pass')
} catch (err) {
  console.error(err)
  process.exitCode = 1
} finally {
  server.close()
}