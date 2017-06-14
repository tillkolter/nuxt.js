import test from 'ava'
import ansiHTML from 'ansi-html'

let utils
// Init nuxt.js and create server listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  const Nuxt = require('../')
  let nuxt = new Nuxt({ dev: false })
  utils = nuxt.utils
})

test('encodeHtml', t => {
  const html = '<h1>Hello</h1>'
  t.is(utils.encodeHtml(html), '&lt;h1&gt;Hello&lt;/h1&gt;')
})

test('getContext', t => {
  let ctx = utils.getContext({ a: 1 }, { b: 2 })
  t.is(utils.getContext.length, 2)
  t.is(typeof ctx.req, 'object')
  t.is(typeof ctx.res, 'object')
  t.is(ctx.req.a, 1)
  t.is(ctx.res.b, 2)
})

test('setAnsiColors', t => {
  utils.setAnsiColors(ansiHTML)
  t.pass()
})

test('waitFor', async (t) => {
  let s = Date.now()
  await utils.waitFor(100)
  t.true(Date.now() - s >= 100)
  await utils.waitFor()
})

test('urlJoin', t => {
  t.is(utils.urlJoin('test', '/about'), 'test/about')
})

test('promisifyRoute (array)', t => {
  const array = [1]
  const promise = utils.promisifyRoute(array)
  t.is(typeof promise, 'object')
  return promise
  .then((res) => {
    t.is(res, array)
  })
})

test('promisifyRoute (fn => array)', t => {
  const array = [1, 2]
  const fn = function () {
    return array
  }
  const promise = utils.promisifyRoute(fn)
  t.is(typeof promise, 'object')
  return promise
  .then((res) => {
    t.is(res, array)
  })
})

test('promisifyRoute (fn => promise)', t => {
  const array = [1, 2, 3]
  const fn = function () {
    return new Promise((resolve) => {
      resolve(array)
    })
  }
  const promise = utils.promisifyRoute(fn)
  t.is(typeof promise, 'object')
  return promise
  .then((res) => {
    t.is(res, array)
  })
})

test('promisifyRoute (fn(cb) with error)', t => {
  const fn = function (cb) {
    cb(new Error('Error here'))
  }
  const promise = utils.promisifyRoute(fn)
  t.is(typeof promise, 'object')
  return promise
  .catch((e) => {
    t.is(e.message, 'Error here')
  })
})

test('promisifyRoute (fn(cb) with result)', t => {
  const array = [1, 2, 3, 4]
  const fn = function (cb) {
    cb(null, array)
  }
  const promise = utils.promisifyRoute(fn)
  t.is(typeof promise, 'object')
  return promise
  .then((res) => {
    t.is(res, array)
  })
})
