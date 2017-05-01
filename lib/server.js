'use strict'

const http = require('http')
const connect = require('connect')
const proxy = require('http-proxy-middleware')

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
    return this
  }

  render (req, res) {
    this.nuxt.render(req, res)
    return this
  }

  listen (port, host) {
    host = host || '127.0.0.1'
    port = port || 3000
    this.server.listen(port, host, () => {
      console.log('Ready on http://%s:%s', host, port) // eslint-disable-line no-console
    })
    return this
  }

  close (cb) {
    return this.server.close(cb)
  }
}

export default Server
