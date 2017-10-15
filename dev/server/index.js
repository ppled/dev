const fractal = require('./fractal.js')
const hbs = require('@frctl/handlebars')
const hbsHelpers = require('./hbs-helpers.js')
const sassMW = require('./middleware/sass.js')
const slashMW = require('./middleware/trailing-slash.js')
const theme = require('./theme/index.js')
const { fromRoot } = require('./utils.js')

function collateComponent (markup, item) {
  return `<h2>${item.handle}</h2>\n${markup}`
}

fractal.set('project.title', 'Petersen Parts')
fractal.components.engine(hbs({ helpers: hbsHelpers }))
fractal.components.set('path', fromRoot('components'))
fractal.components.set('default.collated', true)
fractal.components.set('default.collator', collateComponent)
fractal.docs.set('path', fromRoot('docs'))
fractal.web.theme(theme)

// configure BrowserSync
fractal.web.set('server.sync', true)
fractal.web.set('server.syncOptions', {
  middleware: [
    slashMW(),
    sassMW()
  ],
  files: [
    fractal.components.get('path'),
    fractal.docs.get('path'),
    fractal.web.get('static.path'),
    fromRoot('core')
  ]
})

module.exports = fractal
