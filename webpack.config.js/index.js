const env = require('./env.js')
const glob = require('glob')
const path = require('path')
const setupServer = require('./server/index.js')
const { promisify } = require('util')

const PUBLIC_PATH = path.join(__dirname, '../lib')
const { PORT } = env.get()

async function getEntries () {
  const filepaths = await promisify(glob)(
    '+(components|pages)/*/*.js',
    { cwd: PUBLIC_PATH }
  )

  // TODO: cleanup
  return filepaths
    .filter(filepath => {
      const { dir: dirname, name: filename } = path.parse(filepath)
      const [ type, id ] = dirname.split('/').slice(-2)
      const isComponentEntry = type === 'components' && filename === '_preview'
      const isPageEntry = type === 'pages' && filename === id

      return isComponentEntry || isPageEntry
    })
    .reduce((entries, filepath) => {
      // components/button/_preview.js -> components-button-_preview
      const entryName = filepath
        .replace(path.extname(filepath), '')
        .replace(/\//g, '-')

      return {
        ...entries,
        [entryName]: path.join(PUBLIC_PATH, filepath)
      }
    }, {})
}

module.exports = async () => ({
  entry: await getEntries(),
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  module: { rules: [
    {
      test: /\.styl$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'stylus-loader',
          options: {
            preferPathResolver: 'webpack'
          }
        }
      ]
    }
  ]},
  devtool: 'inline-source-map',
  devServer: {
    before: setupServer(PUBLIC_PATH),
    port: PORT,
    stats: {
      hash: false,
      modules: false,
      performance: false,
      version: false
    }
  }
})
