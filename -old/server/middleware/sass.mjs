import path from 'path'
import router from 'koa-route'
import sass from 'node-sass'
import util from 'util'
import { fileExists } from '../utils.mjs'

const { join } = path
const { promisify } = util

async function render (path) {
  const render = promisify(sass.render.bind(sass))
  const result = await render({ file: path })

  return result.css.toString()
}

export default function serveScss (PUBLIC_PATH) {
  return router.get('**/*.scss', async ctx => {
    const entry = join(process.cwd(), PUBLIC_PATH, ctx.path)

    if (await fileExists(entry)) {
      try {
        const contents = await render(entry)

        ctx.set('Content-Type', 'text/css')
        ctx.body = contents
      } catch (error) {
        ctx.body = `Sass error:\n${error.message}`
      }
    }
  })
}
