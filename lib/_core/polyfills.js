/* global Element */

/* https://developer.mozilla.org/en-US/docs/Web/API/Element/closest */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (selector) {
    var element = this

    if (document.documentElement.contains(element)) {
      do {
        if (element.matches(selector)) {
          return element
        }

        element = element.parentElement || element.parentNode
      } while (element !== null && element.nodeType === 1)
    }

    return null
  }
}
