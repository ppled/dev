const express = require('express')
const viewsMW = require('./middleware/views.js')
const { join } = require('path')

const PUBLIC_PATH = join(__dirname, '../lib')

module.exports = function (app) {
  app.use('/assets', express.static(join(__dirname, '../lib/assets')))

  app.use(viewsMW(PUBLIC_PATH, {
    context: {
      setDefaults (locals, defaults) {
        Object.keys(defaults).forEach(key => {
          if (!locals[key]) locals[key] = defaults[key]
        })
      }
    }
  }))

  app.get('/', (request, response, next) => {
    response.send('This is home!')
  })
}
