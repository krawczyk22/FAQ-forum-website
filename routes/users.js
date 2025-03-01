var Router = require('koa-router');
const User = require('../modules/user.js')
const Contribution = require('../modules/contribution.js')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const Database = require('sqlite-async')
const router = new Router()

const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => {
	try {
		const contribution = await new Contribution(dbName)
		await contribution.updateStars()
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		const sql = 'SELECT questions.id as id, user, title, solved, imagelink, addedbyuserid, dateadded FROM questions INNER JOIN users where users.id = questions.addedbyuserid;'
		const db = await Database.open(dbName)
		const datafromdatabase = await db.all(sql)
		await db.close()
		await ctx.render('index', {title: 'Questions', titlesfromdatabase: datafromdatabase})
		//await ctx.render('index')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/ranking', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		const sql = 'SELECT id, user, contribution, badge FROM users'
		const db = await Database.open(dbName)
		const datafromdatabase = await db.all(sql)
		await db.close()
		await ctx.render('ranking', {rankingfromdatabase: datafromdatabase})
		//await ctx.render('index')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		const {path, type} = ctx.request.files.avatar
		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.user, body.pass)
		await user.uploadPicture(path, type, body.user)
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	const sql = 'SELECT questions.id as id, user, title, solved, imagelink, addedbyuserid, dateadded FROM questions INNER JOIN users ON users.id = questions.addedbyuserid;'
	const db = await Database.open(dbName)
	const datafromdatabase = await db.all(sql)
	await db.close()
	await ctx.render('login', {title: 'Questions', titlesfromdatabase: datafromdatabase})
	//await ctx.render('login', data)
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		const idusername = await user.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.username = idusername
		console.log(idusername)
		return ctx.redirect('/?msg=you are now logged in...')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.username = null
	ctx.redirect('/?msg=you are now logged out')
})

module.exports = router;