#!/usr/bin/env node

//Routes File
//assignment
'use strict'

/* MODULE IMPORTS */
const bcrypt = require('bcrypt-promise')
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const Database = require('sqlite-async')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
const sqlite = require('sqlite-async')
const fs = require('fs-extra')
const mime = require('mime-types')
//const jimp = require('jimp')

/* IMPORT CUSTOM ROUTES */
var comments = require('./routes/comments.js');
var contributions = require('./routes/contributions.js');
var rates = require('./routes/rates.js');
var questions = require('./routes/questions.js');
var users = require('./routes/users.js');

const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

/* DEFINE THE ROUTES ROUTES */
app.use(users.routes());
app.use(comments.routes());
app.use(contributions.routes());
app.use(rates.routes());
app.use(questions.routes());

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'
const saltRounds = 10

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
