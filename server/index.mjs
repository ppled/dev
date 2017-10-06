import addTrailingSlashes from 'koa-add-trailing-slashes'
import env from './env.mjs'
import Koa from 'koa'
import mwAuth from './middleware/auth.mjs'
import mwRollup from './middleware/rollup.mjs'
import mwStylus from './middleware/stylus.mjs'
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
