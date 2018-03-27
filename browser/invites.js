
window.addEventListener('DOMContentLoaded', () => {
  m.mount(document.querySelector('#form'), {
    oninit: (vnode) => {
      vnode.state = {
        active: 0,
        total: 0,
        status: {invite: true},
        send: (e) => {
          // onkeyup
          if (e.type === 'keyup') {
            if (e.keyCode === 13) {
              send(e.target.value)
            }
          }
          // onclick
          else {
            send(e.target.previousSibling.value)
          }
          // onsubmit
          return false
        },
        ui: {
          github: {
            input: 'text',
            placeholder: 'username',
            url: 'https://github.com/' + config.invite.id
          },
          slack: {
            input: 'email',
            placeholder: 'you@yourdomain.com',
            url: 'https://' + config.invite.id + '.slack.com'
          }
        }
      }

      function status (key, value) {
        vnode.state.status.invite = false
        vnode.state.status.wait = false
        vnode.state.status.ok = false
        vnode.state.status.error = false
        vnode.state.status[key] = (key === 'error' ? value : true)
      }

      function send (input) {
        if (!input) {
          return
        }

        if (
          config.invite.provider === 'slack' &&
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(input)) {
          return
        }

        status('wait')

        var data = {key: config.key}
        if (config.invite.provider === 'github') {
          data.user = input
        }
        else if (config.invite.provider === 'slack') {
          data.email = input
        }

        m.request({
          method: 'POST',
          url: config.prefix + '/api/send',
          data
        })
        .then((res) => (res.error)
          ? status('error', res.error)
          : status('ok')
        )
        .catch((err) => console.log(err))
      }

      m.request({
        method: 'GET',
        url: config.prefix + '/api/users',
        data: {key: config.key}
      })
      .then((res) => {
        vnode.state.active = res.active
        vnode.state.total = res.total
      })
      .catch((err) => console.log(err))
    },
    view: (vnode) =>
      m('.splash',
        m('.holder',
          // logo
          m('img.logo', {src: config.prefix + config.static.logo}),

          // title
          m('p', config.string[0], ' ', m('b', config.invite.name), ' ', config.string[1]),

          // status
          m('p.status',
            m('b.active', vnode.state.active), ' ', config.string[2], ' ',
            m('b.total', vnode.state.total), ' ', config.string[3]),

          // form
          m('form', {onsubmit: vnode.state.send},
            m('input[autofocus=true]', {
              type: vnode.state.ui[config.invite.provider].input,
              placeholder: vnode.state.ui[config.invite.provider].placeholder,
              onkeyup: vnode.state.send}),
            m('button[type=button]', {
              onclick: vnode.state.send,
              class: vnode.state.status.ok ? 'success' : vnode.state.status.error ? 'error' : null,
              disabled: vnode.state.status.wait || vnode.state.status.ok
            },
              vnode.state.status.invite ? config.string[4]
              : vnode.state.status.wait ? config.string[5]
              : vnode.state.status.ok ? config.string[6]
              : vnode.state.status.error
            )
          ),

          // footer
          m('p.signin',
            config.string[7],
            ' ',
            m('a[target=_button]', {href: vnode.state.ui[config.invite.provider].url},
              config.string[8]
            )
          )
        ),
        m('.overlay')
      )
  })
})
