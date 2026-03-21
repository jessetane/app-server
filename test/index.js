import fs from 'fs'
import createServer from '../index.js'

const expected = fs.readFileSync('test/fixture/index.html', 'utf8')

const server = createServer({
  port: '7357',
  root: 'test/fixture',
  spa: ['/spa']
})

try {
	const res1 = await fetch('http://localhost:7357')
	const text1 = await res1.text()
	if (text1 !== expected) throw new Error('response did not equal expected value')

	const res2 = await fetch('http://localhost:7357/test.txt')
	const text2 = await res2.text()
	if (text2 !== '-') throw new Error('response did not equal expected value')

	const res3 = await fetch('http://localhost:7357/bogus.html')
	const text3 = await res3.text()
	if (text3 !== expected) throw new Error('response did not equal expected value')

	const res4 = await fetch('http://localhost:7357/spa', { redirect: 'manual' })
	const text4 = await res4.text()
	if (res4.status !== 200 || text4 !== expected) throw new Error('response for /spa did not equal expected SPA index value')

	console.log('all tests pass')
} catch (err) {
	console.error(err)
	process.exitCode = 1
} finally {
	server.close()
}
