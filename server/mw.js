
var express = require('express')


module.exports = ({invite, auth}) => {

  var invites = {
    slack: require('./slack')({invite, auth}),
    github: require('./github')({invite, auth}),
  }

  var mw = express()

  mw.post('/send', (req, res) => {
    var provider = invite[req.body.key].provider

    invites[provider].send(req.body)
      .then((results) => res.json(results[0][1]))
      .catch((err) => res.json({error: err.message}))
  })

  mw.get('/users', (req, res) => {
    var provider = invite[req.query.key].provider

    invites[provider].users(req.query)
      .then((result) => res.json(result))
      .catch((err) => res.json({error: err.message}))
  })

  return Object.assign(mw, ...invites)
}
