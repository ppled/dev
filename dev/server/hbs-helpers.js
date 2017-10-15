const { dirname, join } = require('path')

function getComponentName (path) {
  return dirname(path).split('/').slice(-1)
}

exports.asset = function (path) {
  // console.log('component being viewed', this._env.path)
  console.log('component requesting asset', getComponentName(this._self.viewPath))
  return ''
}
