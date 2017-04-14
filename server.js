// environment vars
require('dotenv').load()

const express = require('express')
const app = express()
const port = process.env.PORT || 1337

app.get('/', (req, res) => {
  res.send('Petersen Parts dev')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
