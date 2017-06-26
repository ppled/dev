const md5 = require('md5')
const pify = require('pify')
const stylus = require('stylus')
const { extname, join } = require('path')
const { pifyCtx } = require('./utils.js')

const fs = pify(require('fs'))
const cache = {}

function getStylusInstance (contents, path) {
  return stylus(contents)
    .set('filename', path)
    .set('sourcemap', { inline: true })
}

async function getContents (path) {
  const contents = await fs.readFile(path, 'utf-8')
  const hash = md5(contents)
  const cacheObj = cache[path]
  let result

  if (cacheObj && cacheObj.hash === hash) {
    result = cacheObj.body
  } else {
    let rendered

    try {
      const instance = getStylusInstance(contents, path)
      const render = pifyCtx(instance.render, instance)

      rendered = await render()
    } catch (error) {
      rendered = error.message
    }

    cache[path] = { hash, body: rendered }
    result = rendered
  }

  return result
}

module.exports = (request, response, next) => {
  const { path } = request

  if (extname(path) === '.styl') {
    const fullpath = join(__dirname, '../public', path)

    // TODO: cache any required or imported files and check against those as well
    if (request.query.clearCache) {
      delete cache[fullpath]
    }

    getContents(fullpath)
      .then(contents => {
        response
          .set('Content-Type', 'text/css')
          .send(contents)
      })
      .catch(() => next())
  } else {
    next()
  }
}
