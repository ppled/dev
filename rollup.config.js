function getExternals () {
  return Object.keys(require('./package.json').dependencies)
    .concat(require('repl')._builtinLibs)
}

export default {
  input: 'server/index.js',
  output: {
    file: 'build/server.js',
    format: 'cjs'
  },
  preferConst: true,
  external: getExternals()
}
