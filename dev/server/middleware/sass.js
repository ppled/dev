const fractal = require('../fractal.js')
const glob = require('glob')
const sass = require('node-sass')
const { basename, dirname, extname, join } = require('path')
const { promisify } = require('util')
const { fileExists, fromRoot } = require('../utils.js')

async function resolvePath (path) {
  let result

  // match /components/[something]/[name]
  // glob for components/**/**/[name].hbs
  //    in name, replace '--default' with ?(--default)
  // get dirname of first match, and replace /components/[something]/[name] with it
  if (/^\/components\//.test(path)) {
    const name = match[2].replace('--default', '?(--default)')
    const mainFile = (await promisify(glob)(`components/**/**/${name}.hbs`))[0]

    if (mainFile) {
      result = fromRoot(
        path.replace(
          match[0],
          '/' + dirname(mainFile)
        )
      )
    }
  }

  return result || fromRoot(path)
}

async function render (path) {
  const render = promisify(sass.render.bind(sass))
  const result = await render({ file: path })

  return result.css.toString()
}

async function getResponse (path) {
  let result = false

  // strip query
  path = path.replace(/\?.*/, '')

  if (extname(path) === '.scss') {
    const entry = await resolvePath(path)

    if (await fileExists(entry)) {
      try {
        result = render(entry)
      } catch (error) {
        result = `Sass error:\n${error.message}`
      }
    }
  }

  return result
}

module.exports = function serveScss () {
  return function (request, response, next) {
    getResponse(request.url)
      .then(result => {
        if (result === false) {
          next()
        } else {
          response.setHeader('Content-Type', 'text/css')
          response.end(result)
        }
      })
      .catch(error => {
        next()
      })
  }
}
