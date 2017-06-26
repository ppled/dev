const { keys } = Object

function isFunction (thing) {
  return typeof thing === 'function'
}

function getAuthUsers () {
  // users in `USER::PASS;` format
  const users = process.env.AUTH_USERS || ''
  const result = {}

  users.split(';')
    // filter out falsy
    .filter(item => item)
    .forEach(pair => {
      const [user, pass] = pair.split('::')
      result[user] = pass
    })

  return result
}

function promiseCallback (resolve, reject) {
  return function (error, result) {
    if (error) {
      reject(error)
    } else {
      resolve(result)
    }
  }
}

function promisifyFunc (func, context) {
  return function () {
    const args = Array.from(arguments)

    return new Promise((resolve, reject) => {
      const callback = promiseCallback(resolve, reject)

      args.push(callback)
      func.apply(context, args)
    })
  }
}

/*
 * Similar to the `pify` module, but allows for
 * providing a functional context when modifying
 * a function directly
 */
function pifyCtx (thing, context) {
  let result

  if (isFunction(thing)) {
    result = promisifyFunc(thing, context)
  }

  return result || thing
}

module.exports = {
  getAuthUsers,
  isFunction,
  pifyCtx
}
