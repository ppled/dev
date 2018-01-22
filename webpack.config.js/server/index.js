const authMW = require('express-basic-auth')
const env = require('../env.js')
const express = require('express')
const path = require('path')
const slashesMW = require('./middleware/slashes.js')
const viewsMW = require('./middleware/views.js')
const { pluralize } = require('../utils.js')

function getAuthUsers () {
  // users in `USER::PASS;` format
  const { AUTH_USERS } = env.get()
  const result = {}

  AUTH_USERS.split(';')
    // filter out empty
    .filter(item => item)
    .forEach(pair => {
      const [ user, pass ] = pair.split('::')
      result[user] = pass
    })

  return result
}

module.exports = PUBLIC_PATH => app => {
  if (process.env.NODE_ENV === 'production') {
    app.use(authMW({
      challenge: true,
      users: getAuthUsers()
    }))
  }

  app.use(slashesMW())
  app.use('/assets', express.static(path.join(__dirname, '../../lib/assets')))

  // rewrite webpack filepaths:
  // /pages+home+home.js -> /pages/home/home.js
  app.use((request, response, next) => {
    const pattern = /^\/(components|pages)\/[\w-]+\/[\w-]+\.(css|js)$/

    if (pattern.test(request.path)) {
      const newPath = '/' + request.path.slice(1).replace(/\//g, '+')

      request.url = request.url.replace(request.path, newPath)
      next('route')
    } else {
      next()
    }
  })

  app.use(viewsMW(PUBLIC_PATH, {
    // ejs base context
    context: {
      doXTimes (amount, callback) {
        for (let i = 1; i <= amount; i++) {
          callback(i)
        }
      },
      pluralize,
      setDefaults (locals, defaults) {
        Object.keys(defaults).forEach(key => {
          if (!locals[key]) locals[key] = defaults[key]
        })
      }
    }
  }))
}
