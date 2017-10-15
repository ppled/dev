const shopifyThemekit = require('@shopify/themekit')
const { promisify } = require('util')
require('../env.js')

const themekit = promisify(shopifyThemekit.command)

async function deploy () {
  return themekit({
    args: ['upload', '--config', '.themekit.yml']
  })
}

deploy().catch(console.error)
