const { extname } = require('path')

module.exports = function addSlashes () {
  return function (request, response, next) {
    const { url } = request

    if (extname(url) || url.slice(-1) === '/') {
      next()
    } else {
      response.statusCode = 301
      response.setHeader('Location', url + '/')
      response.end()
    }
  }
}
