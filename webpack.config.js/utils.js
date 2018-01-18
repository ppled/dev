const fs = require('fs')
const { promisify } = require('util')

function buildQuery (props = {}) {
  return Object.keys(props)
    .map(key => (`${key}=${props[key]}`))
    .join('&')
}

async function fileExists (path) {
  let result = true

  try {
    await promisify(fs.access)(path)
  } catch (error) {
    if (error) {
      result = false
    }
  }

  return result
}

function pluralize (str, amount) {
  return `${str}${amount > 1 ? 's' : ''}`
}

function stripTrailingSlash (path) {
  if (path.slice(-1) === '/') {
    path = path.slice(0, -1)
  }

  return path
}

module.exports = {
  buildQuery,
  fileExists,
  pluralize,
  stripTrailingSlash
}
