import { extname } from 'path'
import { buildQuery } from '../utils.js'

function isMissingSlash (path) {
  return !extname(path) && path[path.length - 1] !== '/'
}

export default function addTrailingSlashes () {
  return async (ctx, next) => {
    const { path } = ctx

    if (isMissingSlash(path)) {
      const query = buildQuery(ctx.query)
      let newPath = path + '/'

      if (query) {
        newPath += '?' + query
      }

      ctx.status = 301
      ctx.redirect(newPath)
    } else {
      return next()
    }
  }
}
