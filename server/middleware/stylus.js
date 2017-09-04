import fs from 'fs'
import md5 from 'md5'
import router from 'koa-route'
import stylus from 'stylus'
import { join } from 'path'
import { promisify } from 'util'
import { fileExists } from '../utils.js'

const CACHE = {}

function getStylusInstance (contents, path) {
  return stylus(contents)
    .set('filename', path)
    .set('sourcemap', { inline: true })
}

async function getAffectedFiles (contents, path) {
  const instance = getStylusInstance(contents, path)
  const importedFiles = instance.deps()
  const result = [
    // add main file
    { contents, path }
  ]

  // get imported files' contents in parallel
  await Promise.all(importedFiles.map(async path => {
    const contents = await promisify(fs.readFile)(path, 'utf-8')

    result.push({ contents, path })
  }))

  return result
}

function fileChanged (file) {
  const { contents, path } = file
  const cacheObj = CACHE[path]
  const hash = md5(contents)
  let result = true

  if (cacheObj && cacheObj.hash === hash) {
    result = false
  }

  return result
}

function updateFileHash (file) {
  const { contents, path } = file
  const cacheObj = CACHE[path] = (CACHE[path] || {})

  if (cacheObj.body) {
    // cached body is no longer valid
    delete cacheObj.body
  }

  cacheObj.hash = md5(contents)
}

async function getContents (path) {
  const cacheObj = CACHE[path]
  const contents = await promisify(fs.readFile)(path, 'utf-8')
  const affectedFiles = await getAffectedFiles(contents, path)
  const changedFiles = affectedFiles.filter(fileChanged)
  // TODO: deps cache should be tied to parent path cache
  // { path: { hash: '', body: '', deps: { } } }
  const shouldRender = changedFiles.length || !cacheObj.body
  let result

  if (shouldRender) {
    const instance = getStylusInstance(contents, path)
    const render = promisify(instance.render.bind(instance))
    const rendered = await render()

    changedFiles.forEach(updateFileHash)
    CACHE[path].body = rendered
    result = rendered
  } else {
    result = cacheObj.body
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
