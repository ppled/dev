const urlUtils = require('url')
const { extname } = require('path')

module.exports = function addSlashes () {
  return function (request, response, next) {
    const { url } = request
    const { pathname } = urlUtils.parse(request.url)

    if (extname(pathname) || pathname.slice(-1) === '/') {
      next()
    } else {
      response.statusCode = 301
      response.setHeader('Location', url.replace(pathname, `${pathname}/`))
      response.end()
    }
  }
}
