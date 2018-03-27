
var url = (prefix, path) =>
  (prefix && /^\/.+/.test(path)) ? (prefix + path) : path

module.exports = ({m, invite, static, string, meta, prefix, key}) =>
  m('html',
    m('head',
      meta.map((attrs, index) =>
        m('meta', meta[index])
      ),

      m('title', [string[0], invite.name, string[1]].join(' ')),

      m('link', {rel: 'shortcut icon', href: static.favicon}),

      static.css.map((path) =>
        m('link', {rel: 'stylesheet', type: 'text/css', href: url(prefix, path)})
      ),

      m('script', {type: 'text/javascript'},
        'var config = ' + JSON.stringify({
          invite, static: {logo: static.logo}, string, prefix, key
        })
      ),

      static.js.map((path) =>
        m('script', {type: 'text/javascript', src: url(prefix, path)})
      )
    ),
    m('body', m('#form'))
  )
