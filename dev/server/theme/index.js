const mandelbrot = require('@frctl/mandelbrot')
const { join } = require('path')

const theme = mandelbrot({
  nav: ['components'],
  panels: ['html', 'info', 'notes'],
  styles: ['default', '/server/theme/theme-mods.scss']
})

theme.addLoadPath(join(__dirname, 'views'))
theme.addStatic(__dirname)

module.exports = theme
