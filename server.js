require('dotenv').load()

const auth = require('express-basic-auth')
const express = require('express')
const { static } = express
const { join } = require('path')

const app = express()
const port = process.env.PORT || 1337

function getUsers () {
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

// authentication
if (process.env.NODE_ENV === 'production') {
  app.use(auth({
    challenge: true,
    realm: process.env.AUTH_REALM,
    users: getUsers()
  }))
}

app.use(static(join(__dirname, 'public')))
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
