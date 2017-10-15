import Component from '../../core/Component.js'

const OPEN_ATTR = 'opened'

export default class Header extends Component {
  init () {
    const ELEMENT = this.element

    this.on('click', '.header-nav-toggle', event => {
      if (ELEMENT.getAttribute(OPEN_ATTR) != undefined) {
        ELEMENT.removeAttribute(OPEN_ATTR)
      } else {
        ELEMENT.setAttribute(OPEN_ATTR, '')
      }
    })
  }
}
