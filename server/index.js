import addTrailingSlashes from 'koa-add-trailing-slashes'
import env from './env.js'
import Koa from 'koa'
import mwAuth from './middleware/auth.js'
import mwRollup from './middleware/rollup.js'
import mwStylus from './middleware/stylus.js'
import serve from 'koa-static'

const { NODE_ENV, PORT } = env.get()
const PUBLIC_PATH = './public'
const server = new Koa()

if (NODE_ENV === 'production') {
  server.use(mwAuth())
}

server.use(mwRollup(PUBLIC_PATH))
server.use(mwStylus(PUBLIC_PATH))
server.use(addTrailingSlashes())
server.use(serve(PUBLIC_PATH))

server.listen(PORT)
console.log(`Server started on http://localhost:${PORT}`)
