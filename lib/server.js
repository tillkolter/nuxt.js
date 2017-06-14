'use strict'

const http = require('http')
const connect = require('connect')
const proxy = require('http-proxy-middleware')
const path = require('path')

class Server {
  constructor (nuxt) {
    this.nuxt = nuxt

    var app = connect()

    var devProxy = nuxt.devProxy
    Object.keys(devProxy).forEach(function (context) {
      var options = devProxy[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      app.use(proxy(options.filter || context, options))
    })

    app.use(this.render.bind(this))

    this.server = http.createServer(app)

    // Initialize
    // this.app = connect()
    // this.server = http.createServer(this.app)
    this.nuxt.ready()
    .then(() => {
      // Add Middleware
      this.nuxt.options.serverMiddleware.forEach(m => {
        this.useMiddleware(m)
      })
      // Add default render middleware
      this.useMiddleware(this.render.bind(this))
    })
    return this
  }

  useMiddleware (m) {
    // Require if needed
    if (typeof m === 'string') {
      let src = m
      // Using ~ or ./ shorthand to resolve from project srcDir
      if (src.indexOf('~') === 0 || src.indexOf('./') === 0) {
        src = path.join(this.nuxt.options.srcDir, src.substr(1))
      }
      // eslint-disable-next-line no-eval
      m = eval('require')(src)
    }
    if (m instanceof Function) {
      this.app.use(m)
    } else if (m && m.path && m.handler) {
      this.app.use(m.path, m.handler)
    }
  }

  render (req, res, next) {
    this.nuxt.render(req, res)
    return this
  }

  listen (port, host) {
    host = host || '127.0.0.1'
    port = port || 3000
    this.nuxt.ready()
    .then(() => {
      this.server.listen(port, host, () => {
        console.log('Ready on http://%s:%s', host, port) // eslint-disable-line no-console
      })
    })
    return this
  }

  close (cb) {
    return this.server.close(cb)
  }
}

export default Server
