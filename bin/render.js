
var fs = require('fs')
var path = require('path')

var render = require('mithril-node-render')
var html = require('html')

var m = (() => {
  // https://github.com/lhorie/mithril.js/issues/1279#issuecomment-278561782

  var m

  // Polyfill DOM env for mithril
  global.window = require('mithril/test-utils/browserMock.js')()
  global.document = window.document

  // Require the lib AFTER THE POLYFILL IS UP
  m = require('mithril')

  // Make available globally for client scripts running on the server
  global.m = m

  // Export for normal server usage
  return m
})()

var index = require('../browser/index')


module.exports = ({invite, static, string, meta, prefix, key}) =>
  render({
    view: () => index({m, invite, static, string, meta, prefix, key})
  })
  .then((rendered) =>
    html.prettyPrint(
      '<!DOCTYPE html>\n' + rendered,
      {indent_size: 2}
    )
  )
