import Component from '../../_core/Component.js'
import './header.styl'

const OPEN_ATTR = 'opened'

export default class Header extends Component {
  init () {
    const ELEMENT = this.element

    this.on('click', '.header-nav-toggle', event => {
      if (ELEMENT.getAttribute(OPEN_ATTR) != undefined) { // eslint-disable-line eqeqeq
        ELEMENT.removeAttribute(OPEN_ATTR)
      } else {
        ELEMENT.setAttribute(OPEN_ATTR, '')
      }
    })
  }
}
