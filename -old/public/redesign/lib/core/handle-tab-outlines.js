import { isTouchScreen } from './_utils.js'

if (!isTouchScreen()) {
  const DISABLED_CLASS = 'outlines-disabled'
  const BODY = window.document.body

  window.document.addEventListener('keydown', event => {
    if (event.code === 'Tab' && BODY.classList.contains(DISABLED_CLASS)) {
      BODY.classList.remove(DISABLED_CLASS)
    }
  })

  window.document.addEventListener('mousedown', event => {
    if (!BODY.classList.contains(DISABLED_CLASS)) {
      BODY.classList.add(DISABLED_CLASS)
    }
  })
}
