/* eslint-disable no-new */

import Header from '../components/header/header.js'
import '../_core/handle-tab-outlines.js'
import '../_core/polyfills.js'
import '../_core/page.styl'
import '../components/footer/footer.styl'

document.querySelector('html').classList.remove('nojs')

new Header(
  document.querySelector('.site-header')
)
