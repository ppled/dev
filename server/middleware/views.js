const ejs = require('ejs')
const { extname, join } = require('path')
const { promisify } = require('util')
const { fileExists } = require('../utils.js')

const POSSIBLE_FILENAMES = ['index.ejs', '_preview.ejs']

async function whichFileExists (files) {
  const results = await Promise.all(files.map(fileExists))

  return results
    // map filenames with existing files
    .map((item, i) => item === false ? item : files[i])
    // return first existing
    .find(item => item !== false)
}

async function render (path, options) {
  const renderFile = promisify(ejs.renderFile.bind(ejs))
  return renderFile(path, {}, options)
}

module.exports = function handleViews (PUBLIC_PATH, options = {}) {
  return (request, response, next) => {
    const { path } = request

    if (path && !extname(path)) {
      const fullpath = join(PUBLIC_PATH, path)
      const getEntry = whichFileExists.bind(null,
        POSSIBLE_FILENAMES.map(filename => {
          // e.g. /requested/path/ -> /requested/path/index.ejs
          return join(fullpath, filename)
        })
      )

      getEntry()
        .then(entry => {
          if (entry) {
            options.root = PUBLIC_PATH

            render(entry, options)
              .then(body => response.send(body))
              .catch(error => response.send(`ejs error:\n${error.stack}`))
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
