module.exports = {
  loading: true,
  modules: [
    '~modules/basic',
    {
      src: '~/modules/middleware',
      options: {
        foo: 'bar'
      }
    },
    ['./modules/template', {baz: 'ping'}]
  ],
  serverMiddleware: [
    './modules/middleware/midd2'
  ]
}
