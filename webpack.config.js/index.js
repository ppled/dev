const authMW = require('express-basic-auth')
const env = require('./env.js')
const express = require('express')
const glob = require('glob')
const slashesMW = require('./middleware/slashes.js')
const viewsMW = require('./middleware/views.js')
const { dirname, join, sep: PATH_SEP } = require('path')
const { promisify } = require('util')

const PUBLIC_PATH = join(__dirname, '../lib')
const { PORT } = env.get()

function generateEntries (filepaths = []) {
  return filepaths.reduce((entries, filepath) => {
    const dirnames = dirname(filepath).split(PATH_SEP)
    const [ type, id ] = dirnames.slice(-2)
    const entryName = `${type}-${id}`

    return {
      ...entries,
      [entryName]: filepath
    }
  }, {})
}

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

function setupServer (app) {
  if (process.env.NODE_ENV === 'production') {
    app.use(authMW({
      challenge: true,
      users: getAuthUsers()
    }))
  }

  app.use('/assets', express.static(join(__dirname, '../lib/assets')))
  app.use(slashesMW())
  app.use(viewsMW(PUBLIC_PATH, {
    // ejs base context
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

module.exports = async () => {
  const asyncGlob = promisify(glob)
  const entryPaths = await asyncGlob(
    'lib/+(components|pages)/*/+(index|_preview).js',
    { absolute: true }
  )

  return {
    entry: generateEntries(entryPaths),
    output: {
      filename: '[name].js',
      path: join(__dirname, 'dist')
    },
    module: { rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]},
    devtool: 'inline-source-map',
    devServer: {
      after: setupServer,
      contentBase: './dist',
      port: PORT
    }
  }
}
