const path = require('path')

module.exports = function () {
    // Disable parsing pages/
    this.nuxt.createRoutes = () => {}
    // Add /api endpoint
    this.addTemplate({
        fileName: 'router.js',
        src: path.resolve(this.nuxt.srcDir, 'router.js')
    })
}
