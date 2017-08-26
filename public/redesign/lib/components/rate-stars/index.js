(() => {
  const CLASSES = {
    radios: '.rate-label .label-radio'
  }

  function isFunction (thing) {
    return typeof thing === 'function'
  }

  class Component {
    constructor (element) {
      this.element = element

      if (isFunction(this.addEvents)) {
        this.addEvents()
      }
    }

    on (eventName, selector, handler) {
      this.element.addEventListener(eventName, event => {
        const { target: targetElement } = event
        const selectorMatch = targetElement.closest(selector)

        if (selectorMatch && this.element.contains(selectorMatch)) {
          handler(targetElement)
        }
      })
    }
  }

  class RateStars extends Component {
    addEvents () {
      this.on('click', CLASSES.radios, radio => {
        this.element.setAttribute('data-stars', radio.value)
      })
    }
  }

  window.RateStars = RateStars
})()
