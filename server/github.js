
var request = require('request-compose').client


module.exports = ({invite, auth}) => ({

  send: ({key, user}) => Promise.all(
    [key].concat(invite[key].other || []).map((key) =>
      request({
        method: 'PUT',
        url:
          `https://api.github.com/orgs/${invite[key].id}/memberships/${user}`,
        headers: {
          authorization: `Bearer ${auth[key]}`,
          'user-agent': 'inviter',
        }
      })
    )
  ),

  users: ({key}) => new Promise((resolve, reject) => {
    var active = 0
    ;(function get (page) {
      request({
        method: 'GET',
        url:
          `https://api.github.com/orgs/${invite[key].id}/members`,
        headers: {
          authorization: `Bearer ${auth[key]}`,
          'user-agent': 'inviter',
        },
        qs: {
          page,
        }
      })
      .then(({body}) => {
        active += body.length
        ;(!body.length || body.length < 30)
          ? resolve({active})
          : get(++page)
      })
      .catch(reject)
    })(1)
  })
})
