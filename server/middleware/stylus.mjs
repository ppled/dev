import fs from 'fs'
import path from 'path'
import router from 'koa-route'
import stylus from 'stylus'
import util from 'util'
import { fileExists, getFileModTime } from '../utils.mjs'

const { join } = path
const { promisify } = util
const CACHE = {}

class StylusCache {
  constructor (path) {
    this.body = null
    this.files = {}
    this.path = path
  }

  get () {
    return this.body
  }

  async isValid (instance) {
    let result = true

    if (this.body && instance.get('filename') === this.path) {
      const keys = Object.keys(this.files)

      for (let i = 0; i < keys.length; i++) {
        const path = keys[i]
        const modTime = this.files[path]

        if (await getFileModTime(path) > modTime) {
          result = false
          break
        }
      }
    } else {
      result = false
    }

    return result
  }

  async update (instance, body) {
    const files = [ this.path ]
      .concat(instance.deps())

    this.body = body
    this.files = {}

    for (let i = 0; i < files.length; i++) {
      const path = files[i]
      this.files[path] = await getFileModTime(path)
    }
  }
}

async function getStylusInstance (path) {
  const contents = await promisify(fs.readFile)(path, 'utf-8')

  return stylus(contents)
    .set('filename', path)
    .set('sourcemap', { inline: true })
}

async function getContents (path) {
  const instance = await getStylusInstance(path)
  const cache = CACHE[path] = (CACHE[path] || new StylusCache(path))
  let result

  if (await cache.isValid(instance)) {
    result = cache.get()
  } else {
    const render = promisify(instance.render.bind(instance))

    result = await render()
    await cache.update(instance, result)
  }

  return result
}

export default function serveStyl (PUBLIC_PATH) {
  return router.get('**/*.styl', async ctx => {
    const entry = join(process.cwd(), PUBLIC_PATH, ctx.path)

    if (await fileExists(entry)) {
      try {
        const contents = await getContents(entry)

        ctx.set('Content-Type', 'text/css')
        ctx.body = contents
      } catch (error) {
        ctx.body = `Stylus error:\n${error.message}`
      }
    }
  })
}
