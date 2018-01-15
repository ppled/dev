import auth from 'basic-auth'
import env from '../../../common/env.js'

function getUsers () {
  // users in `USER::PASS;` format
  const { AUTH_USERS } = env.get()
  const result = {}

  AUTH_USERS.split(';')
    // filter out falsy
    .filter(item => item)
    .forEach(pair => {
      const [ user, pass ] = pair.split('::')
      result[user] = pass
    })

  return result
}

export default function handleAuth () {
  const users = getUsers()

  return async (ctx, next) => {
    let isAuthorized

    try {
      const user = auth(ctx)

      if (users[user.name] && user.pass === users[user.name]) {
        isAuthorized = true
      }
    } catch (error) {
      isAuthorized = false
    }

    if (isAuthorized) {
      return next()
    } else {
      ctx.set('WWW-Authenticate', 'Basic')
      ctx.status = 401
    }
  }
}
