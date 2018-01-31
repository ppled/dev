const ejs = require('ejs')
const prettyHtml = require('pretty')
const { dirname, extname, join } = require('path')
const { promisify } = require('util')
const { escapeHtml, fileExists, stripTrailingSlash } = require('../../utils.js')

async function render (path, options) {
  const renderFile = promisify(ejs.renderFile.bind(ejs))
  let data = {}

  try {
    const dataPath = join(dirname(path), '_data.json')

    // clear cache to always get fresh data
    delete require.cache[require.resolve(dataPath)]
    data = require(dataPath)
  } catch (e) {}

  return renderFile(path, data, options)
}

async function getEntry (path) {
  const [ id ] = stripTrailingSlash(path).split('/').slice(-1)
  // for /pages/home/, check:
  //   pages/home/home.ejs
  //   pages/home/_preview.ejs
  const files = ['_preview', id]
    .map(filename => `${path + filename}.ejs`)
  const results = await Promise.all(files.map(fileExists))

  return results
    // if file exists, map to filename
    .map((item, i) => item === false ? item : files[i])
    // return first existing
    .find(item => item !== false)
}

module.exports = function handleViews (PUBLIC_PATH, options = {}) {
  return (request, response, next) => {
    const { path } = request

    // NO - /
    // NO - /pages/home/home.js
    // YES - /pages/home/
    if (path && path !== '/' && !extname(path)) {
      const fullpath = join(PUBLIC_PATH, path)

      getEntry(fullpath)
        .then(entry => {
          if (entry) {
            options.root = PUBLIC_PATH

            render(entry, options)
              .then(body => {
                if ((request.query || {}).hasOwnProperty('pretty')) {
                  body = prettyHtml(body, { ocd: true })
                }

                response.send(body)
              })
              .catch(error => {
                response.send(`<pre>${escapeHtml(error.stack)}</pre>`)
              })
          } else {
            next()
          }
        })
        .catch(() => next())
    } else {
      return next()
    }
  }
}
