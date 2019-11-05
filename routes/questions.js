var Router = require('koa-router');
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const mime = require('mime-types')
const Database = require('sqlite-async')
const Question = require('../modules/question.js')
const router = new Router()

const dbName = 'website.db'

router.post('/addQuestion', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(ctx.request.files.questionimage)
		const {path, type} = ctx.request.files.questionimage
		// call the functions in the module
		const question = await new Question(dbName)
		const extension = mime.extension(type)
		if(extension !== 'bin')
		{
			await question.addQuestion(body.title, body.description, `${body.title}.${extension}`, 1)
			await question.uploadQuestionImage(path, type, body.title)
		}
		else 
			await question.addQuestion(body.title, body.description, '', 1)
		// redirect to the home page
		ctx.redirect(`/`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/question', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	const sqlquestions = `SELECT id, title, description, imagelink FROM questions WHERE id = ${data.msg};`
	const sqlcomments = `SELECT users.user, comments.id, content, addedbyuserid, questionsid, iscorrect FROM comments INNER JOIN users ON comments.addedbyuserid = users.id WHERE questionsid = ${data.msg};`
	const db = await Database.open(dbName)
	const questionsdatafromdatabase = await db.all(sqlquestions)
	const commentsdatafromdatabase = await db.all(sqlcomments)
	await db.close()
	console.log(questionsdatafromdatabase)
	console.log(commentsdatafromdatabase)
	if(ctx.session.authorised !== true)
		await ctx.render('question', {title: questionsdatafromdatabase, commentsfromdatabase: commentsdatafromdatabase})
	else
		await ctx.render('questionwithcomments', {title: questionsdatafromdatabase, commentsfromdatabase: commentsdatafromdatabase})
})

module.exports = router;