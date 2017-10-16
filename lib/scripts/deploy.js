const themekit = require('shopify-themekit')
require('../env.js')

async function deploy () {
  return themekit('upload', {
    config: '.themekit.yml'
  })
}

deploy().catch(console.error)
