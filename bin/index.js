#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log(`
    Configuration:
    --invite    /path/to/invite.json
    --static    /path/to/static.json
    --string    /path/to/string.json
    --auth      /path/to/auth.json
    --meta      /path/to/meta.json
    Environment:
    --key       configuration-key
    --prefix    /static/path/prefix
    --render    /path/to/index.html
    --assets    /path/to/assets/location/
  `)
  process.exit()
}

var fs = require('fs')
var path = require('path')


// render index.html
require('./render')({
  invite: require(path.resolve(process.cwd(), argv.invite))[argv.key],
  static: require(path.resolve(process.cwd(), argv.static))[argv.key],
  string: require(path.resolve(process.cwd(), argv.string))[argv.key],
  meta: require(path.resolve(process.cwd(), argv.meta))[argv.key],
  prefix: typeof argv.prefix === 'string' ? argv.prefix : '',
  key: argv.key,
})
.then((html) => {
  fs.writeFileSync(path.resolve(process.cwd(), argv.render), html, 'utf8')
})

// copy assets
fs.writeFileSync(
  path.resolve(process.cwd(), argv.assets, 'invites.css'),
  fs.readFileSync(path.resolve(__dirname, '../browser/invites.css'))
)
fs.writeFileSync(
  path.resolve(process.cwd(), argv.assets, 'invites.js'),
  fs.readFileSync(path.resolve(__dirname, '../browser/invites.js'))
)
