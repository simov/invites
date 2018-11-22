
# invites

[![npm-version]][npm]

> Public invites for Slack and GitHub

## invite.json

```json
{
  "my awesome slack org": {
    "provider": "slack",
    "id": "[SLACK ORG ID]",
    "other": []
  },
  "my awesome github org": {
    "provider": "github",
    "id": "[GITHUB ORG ID]",
    "other": []
  }
}
```

## auth.json

```json
{
  "my awesome slack org": "[SLACK ACCESS TOKEN]",
  "my awesome github org": "[GITHUB ACCESS TOKEN]"
}
```

## middleware

```js
var express = require('express')
var invites = require('invites')
var config = {invite: require('./invite.json'), auth: require('./auth.json')}

express()
  .use(invites(config))
  .listen(3000)
```

## api

```js
var express = require('express')
var parser = require('body-parser')
var invites = require('invites')
var config = {invite: require('./invite.json'), auth: require('./auth.json')}
var providers = {slack: invites.slack(config), github: invites.github(config)}

express()
  .use(parser.urlencoded({extended: true}))
  .use(parser.json())
  .post('/send', (req, res) => {
    var name = config.invite[req.body.key].provider

    providers[name].send(req.body)
      .then((results) => res.json(results[0][1]))
      .catch((err) => res.json({error: err.message}))
  })
  .get('/users', (req, res) => {
    var name = config.invite[req.query.key].provider

    providers[name].users(req.query)
      .then((result) => res.json(result))
      .catch((err) => res.json({error: err.message}))
  })
  .listen(3000)
```


  [npm-version]: https://img.shields.io/npm/v/invites.svg?style=flat-square (NPM Package Version)

  [npm]: https://www.npmjs.com/package/invites
