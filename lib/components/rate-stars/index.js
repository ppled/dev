import Component from '../../_core/Component.js'

const CLASSES = {
  radios: '.rate-label .label-radio'
}

export default class RateStars extends Component {
  init () {
    this.on('click', CLASSES.radios, radio => {
      this.element.setAttribute('data-stars', radio.value)
    })
  }
}
