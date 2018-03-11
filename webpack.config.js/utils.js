const fs = require('pfs')

function buildQuery (props = {}) {
  return Object.keys(props)
    .map(key => (`${key}=${props[key]}`))
    .join('&')
}

async function fileExists (path) {
  let result = true

  try {
    await fs.access(path)
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

function escapeHtml (string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }

  return String(string).replace(/[&<>"'`=/]/g, match => {
    return entityMap[match]
  })
}

module.exports = {
  buildQuery,
  escapeHtml,
  fileExists,
  pluralize,
  stripTrailingSlash
}
