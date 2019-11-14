var Router = require('koa-router');
const Comment = require('../modules/comment.js')
const Question = require('../modules/question.js')
const Contribution = require('../modules/contribution.js')
const router = new Router()

const dbName = 'website.db'

router.post('/addComment', async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		//console.log(body)
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		console.log(data.msg)
		const comment = await new Comment(dbName)
		await comment.addComment(data.msg, body.content, ctx.session.username)
		// redirect to the home page
		ctx.redirect(`/question?msg=${data.msg}`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.post('/updateCommentIsCorrect', async ctx => {
	try {
		// extract the data from the request
		const data = {}
		if(ctx.query.comment) data.comment = ctx.query.comment
		if(ctx.query.addedbyuser) data.addedbyuser = ctx.query.addedbyuser
		if(ctx.query.questionsid) data.questionsid = ctx.query.questionsid
		const comment = await new Comment(dbName)
		const question = await new Question(dbName)
		const contribution = await new Contribution(dbName)
		console.log(data.addedbyuser)
		console.log(ctx.session.username)
		await comment.updateCommentIsCorrect(data.questionsid, data.comment, data.addedbyuser, ctx.session.username)
		await question.updateQuestionIsSolved(data.questionsid)
		await contribution.addFiftyPoints(data.addedbyuser)
		await contribution.updateStars()
		ctx.redirect(`/question?msg=${data.questionsid}`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router;
