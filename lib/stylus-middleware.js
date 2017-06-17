const md5 = require('md5')
const pify = require('pify')
const stylus = require('stylus')
const { extname, join } = require('path')
const fs = pify(require('fs'))
const cache = {}

function getContents (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8')
      .then(contents => {
        const hash = md5(contents)
        const cacheObj = cache[path]

        if (cacheObj && cacheObj.hash === hash) {
          resolve(cacheObj.body)
        } else {
          stylus(contents)
            .set('filename', path)
            .set('sourcemap', { inline: true })
            .render((error, result) => {
              if (error) {
                result = error.message
              }

              cache[path] = { hash, body: result }
              resolve(result)
            })
        }
      })
      .catch(reject)
  })
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
