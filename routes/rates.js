var Router = require('koa-router');
const Rate = require('../modules/rate.js')
const router = new Router()

const dbName = 'website.db'

router.post('/addRate', async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		const data = {}
		if(ctx.query.questionsid) data.questionsid = ctx.query.questionsid
		if(ctx.query.commentsid) data.commentsid = ctx.query.commentsid
		if(ctx.query.addedbyuser) data.addedbyuser = ctx.query.addedbyuser
		const rate = await new Rate(dbName)
		await rate.addRate(data.questionsid, data.commentsid, body.rate, data.addedbyuser, ctx.session.username)
		// redirect to the home page
		ctx.redirect(`/question?msg=${data.questionsid}`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router;