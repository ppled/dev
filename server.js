// environment vars
require('dotenv').load()

const Hapi = require('hapi')
const server = new Hapi.Server()

server.connection({
  host: 'localhost',
  port: process.env.port || 1337
})

server.route({
  method: 'GET',
  path: '/',
  handler (request, reply) {
    return reply('Petersen Parts dev')
  }
})

server.start(err => {
  if (err) throw err

  console.log('Server running at:', server.info.uri)
})
