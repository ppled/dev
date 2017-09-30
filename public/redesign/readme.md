# Redesign

## TODO

### Misc

- support/compatibility
  - schema tags
  - accessibility ([a11y](http://a11yproject.com/checklist.html), [Bootstrap](http://getbootstrap.com/getting-started/#accessibility))
  - nojs handling (add nojs class to html; modify experience for anything that requires js)
- forms
  - make component for enabling button when valid
  - focus animation on bottom-line inputs
- add [polyfill](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest) for Element.closest
- decide if breadcrumbs should be added
  - depends on the category structure we move to
- once mockups are done, hardcore browser test

### Pages

- header/footer (100%)
  - maybe fade in animation on header links underline
  - build full mobile drawer interactions
  - shopping cart badge in mobile header
    - support for badge
    - sr-only text
- homepage (70%)
- about
- product list
- product page (85%)
  - determine if pagination should be used in reviews
  - for quantity inputs, on blur, if value is empty, set to 1
  - possibly add play button icon over video gallery thumbnails
- blog list (100%)
  - live filter posts when searched
- blog post
- installation

### Cleanup

- try out templating engine for components/widgets so HTML isn't as repeated
