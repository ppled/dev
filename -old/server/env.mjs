import dotenv from 'dotenv'

// local env vars
dotenv.load()

let cache

function get () {
  if (!cache) {
    const { NODE_ENV, PORT } = process.env

    cache = Object.assign(process.env, {
      NODE_ENV: NODE_ENV || 'development',
      PORT: PORT || 1337
    })
  }

  return cache
}

export default {
  get
}
