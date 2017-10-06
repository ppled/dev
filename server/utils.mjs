import fs from 'fs'
import util from 'util'

const { promisify } = util

export function isFunction (thing) {
  return typeof thing === 'function'
}

export async function fileExists (path) {
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

export async function getFileModTime (path) {
  let result

  try {
    const stats = await promisify(fs.stat)(path)
    result = stats.mtime
  } catch (error) {
    result = null
  }

  return result
}
