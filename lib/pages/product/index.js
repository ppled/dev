/* eslint-disable no-new */

import RateStars from '../../lib/components/rate-stars/index.js'
import '../_globals.js'

// TODO: find non-jquery lightbox
// $('#product-main-gallery [data-fancybox]').fancybox({
//   loop: true,
//   toolbar: false
// })

new RateStars(
  document.getElementById('product-rate-stars')
)
