export default class Component {
  constructor (element) {
    this.element = element
    this.init()
  }

  init () {
    // placeholder to be overriden
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
