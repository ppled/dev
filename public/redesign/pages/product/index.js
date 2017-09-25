import RateStars from '../../lib/components/rate-stars/index.js'

$('#product-main-gallery [data-fancybox]').fancybox({
  loop: true,
  toolbar: false
})

new RateStars(
  document.getElementById('product-rate-stars')
)
