const md5 = require('md5')
const pify = require('pify')
const stylus = require('stylus')
const { extname, join } = require('path')
const { pifyCtx } = require('./utils.js')

const fs = pify(require('fs'))
const cache = {}

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
    const contents = await fs.readFile(path, 'utf-8')

    result.push({ contents, path })
  }))

  return result
}

function fileChanged (file) {
  const { contents, path } = file
  const cacheObj = cache[path]
  const hash = md5(contents)
  let isChanged = true

  if (cacheObj && cacheObj.hash === hash) {
    isChanged = false
  }

  return isChanged
}

function updateFileHashes (files) {
  files.forEach(file => {
    const { contents, path } = file
    const cacheObj = cache[path] = (cache[path] || {})

    if (cacheObj.body) {
      // cached body is no longer valid
      delete cacheObj.body
    }

    cacheObj.hash = md5(contents)
  })
}

async function getContents (path) {
  const cacheObj = cache[path]
  const contents = await fs.readFile(path, 'utf-8')
  const affectedFiles = await getAffectedFiles(contents, path)
  const changedFiles = affectedFiles.filter(fileChanged)
  const shouldRender = changedFiles.length > 0 || !cacheObj.body

  if (shouldRender) {
    let rendered

    try {
      const instance = getStylusInstance(contents, path)
      const render = pifyCtx(instance.render, instance)

      rendered = await render()
    } catch (error) {
      rendered = error.message
    }

    updateFileHashes(changedFiles)
    cache[path].body = rendered
    result = rendered
  } else {
    result = cacheObj.body
  }

  return result
}

module.exports = (request, response, next) => {
  const { path } = request

  if (extname(path) === '.styl') {
    const fullpath = join(__dirname, '../public', path)

    getContents(fullpath)
      .then(contents => {
        response
          .set('Content-Type', 'text/css')
          .send(contents)
      })
      .catch(() => next())
  } else {
    next()
  }
}
