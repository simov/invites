
var express = require('./lib/express')
var github = require('./lib/github')
var slack = require('./lib/slack')

module.exports = Object.assign(express, {github, slack})
