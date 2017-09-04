import fs from 'fs'
import { promisify } from 'util'

function isFunction (thing) {
  return typeof thing === 'function'
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

export {
  fileExists,
  isFunction
}
