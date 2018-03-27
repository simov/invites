
var request = require('request-compose').client


module.exports = ({invite, auth}) => ({

  send: ({key, email}) => Promise.all(
    [key].concat(invite[key].other || []).map((key) =>
      request({
        method: 'POST',
        url: 'https://slack.com/api/users.admin.invite',
        headers: {
          authorization: `Bearer ${auth[key]}`
        },
        form: {
          email,
        }
      })
    )
  ),

  users: ({key}) =>
    request({
      method: 'GET',
      url: 'https://slack.com/api/users.list',
      headers: {
        authorization: `Bearer ${auth[key]}`
      },
      qs: {
        presence: true
      }
    })
    .then(({body}) => ((
      total = body.members
        .filter((user) => !user.is_bot && !user.deleted)
      ) => ({
        total: total.length,
        active: total
          .filter((user) => user.presence === 'active').length
      }))())
})
