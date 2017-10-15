const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')

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

function fromRoot (path = '') {
  return join(__dirname, '../', path)
}

module.exports = {
  fileExists,
  fromRoot
}
