
var express = require('express')
var parser = require('body-parser')


module.exports = ({invite, auth}) => ((
  invites = {
    slack: require('./slack')({invite, auth}),
    github: require('./github')({invite, auth}),
  }
) => express()
  .use(parser.urlencoded({extended: true}))
  .use(parser.json()) // m.request
  .post('/send', (req, res) => {
    var provider = invite[req.body.key].provider

    invites[provider].send(req.body)
      .then((results) => res.json(results[0][1]))
      .catch((err) => res.json({error: err.message}))
  })
  .get('/users', (req, res) => {
    var provider = invite[req.query.key].provider

    invites[provider].users(req.query)
      .then((result) => res.json(result))
      .catch((err) => res.json({error: err.message}))
  }))()
