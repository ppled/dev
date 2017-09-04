require('dotenv').load()

const express = require('express')
const stylusMW = require('./middleware/stylus.js')
const { extname, join } = require('path')

const PORT = process.env.PORT || 1337
const PUBLIC_PATH = join(__dirname, '../public')
const app = express()
const { static } = express

// authentication
if (process.env.NODE_ENV === 'production') {
  const auth = require('express-basic-auth')
  const { getAuthUsers } = require('./utils.js')

  app.use(auth({
    challenge: true,
    realm: process.env.AUTH_REALM,
    users: getAuthUsers()
  }))
}

app.use(stylusMW)
app.use(static(PUBLIC_PATH))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
