var Router = require('koa-router');
const Contribution = require('../modules/contribution.js')
const router = new Router()

const dbName = 'website.db'

router.post('/takeFivePointsOff', async ctx => {
	try {
		// extract the data from the request
		const data = {}
		if(ctx.query.userid) data.userid = ctx.query.userid
		if(ctx.query.questionsid) data.questionsid = ctx.query.questionsid
		const contribution = await new Contribution(dbName)
		await contribution.takeFivePointsOff(data.userid)
		await contribution.updateStars()
		// redirect to the home page
		ctx.redirect(`/question?msg=${data.questionsid}`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router;