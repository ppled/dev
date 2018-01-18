/* eslint-disable no-new */

import RateStars from '../../components/rate-stars/rate-stars.js'
import '../_globals.js'
import './product.styl'

// TODO: find non-jquery lightbox
// $('#product-main-gallery [data-fancybox]').fancybox({
//   loop: true,
//   toolbar: false
// })

new RateStars(
  document.getElementById('product-rate-stars')
)
