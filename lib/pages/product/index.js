import RateStars from '../../lib/components/rate-stars/index.js'
import '../_globals.js'

$('#product-main-gallery [data-fancybox]').fancybox({
  loop: true,
  toolbar: false
})

new RateStars(
  document.getElementById('product-rate-stars')
)
