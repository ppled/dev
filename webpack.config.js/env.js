// local env vars
require('dotenv').load()

let cache

exports.get = function () {
  if (!cache) {
    const { NODE_ENV, PORT } = process.env

    cache = Object.assign(process.env, {
      NODE_ENV: NODE_ENV || 'development',
      PORT: PORT || 1337
    })
  }

  return cache
}
