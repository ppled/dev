import router from 'koa-route'
import { rollup } from 'rollup'
import { join } from 'path'
import { fileExists } from '../utils.js'

const CACHE = {}
const CONFIG = {
  format: 'iife',
  sourcemap: true
}

export default function serveJS (PUBLIC_PATH) {
  return router.get('**/*.js', async ctx => {
    const entry = join(process.cwd(), PUBLIC_PATH, ctx.path)

    if (await fileExists(entry)) {
      const cache = CACHE[entry]

      try {
        const bundle = await rollup({ cache, input: entry })
        const output = await bundle.generate(CONFIG)

        CACHE[entry] = bundle
        ctx.body = output.code + '\n//# sourceMappingURL=' + output.map.toUrl()
      } catch (error) {
        ctx.body = `Rollup error:\n${error.stack}`
      }
    }
  })
}
