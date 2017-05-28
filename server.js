require('dotenv').load()

const auth = require('express-basic-auth')
const express = require('express')
const stylus = require('stylus')
const { join } = require('path')
const { static } = express

const app = express()
const PORT = process.env.PORT || 1337
const PUBLIC_PATH = join(__dirname, 'public')

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

app.use(stylus.middleware({
  src: PUBLIC_PATH,
  sourcemap: true
}))

app.use(static(PUBLIC_PATH))
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
