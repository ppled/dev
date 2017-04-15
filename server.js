// environment vars
require('dotenv').load()

const express = require('express')
const { static } = express
const { join } = require('path')

const app = express()
const port = process.env.PORT || 1337

app.use(static(join(__dirname, 'public')))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
