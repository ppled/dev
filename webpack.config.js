const configureServer = require('./server/index.js')
const glob = require('glob')
const path = require('path')
const { promisify } = require('util')

function generateEntries (filepaths = []) {
  return filepaths.reduce((entries, filepath) => {
    const dirnames = path.dirname(filepath).split(path.sep)
    const [ type, id ] = dirnames.slice(-2)
    const entryName = `${type}-${id}`

    return {
      ...entries,
      [entryName]: filepath
    }
  }, {})
}

module.exports = async () => {
  const asyncGlob = promisify(glob)
  const entryPaths = await asyncGlob(
    'lib/+(components|pages)/*/+(index|_preview).js',
    { absolute: true }
  )

  return {
    entry: generateEntries(entryPaths),
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist')
    },
    module: { rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]},
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      before: configureServer
    }
  }
}
