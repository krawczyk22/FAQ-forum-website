
'use strict'

const Accounts = require('../modules/user.js')
const Questions = require('../modules/question.js')

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('doej', 'password')
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		await expect( account.register('doej', 'password') )
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('error if blank username and password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('', '') )
			.rejects.toEqual( Error('missing username and password') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('', 'password') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', '') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

})

describe('uploadPicture()', () => {
	// this would have to be done by mocking the file system
	// perhaps using mock-fs?
})

describe('login()', () => {
	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		const valid = await account.login('doej', 'password')
		expect(valid).toBe(true)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		await expect( account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})

describe('addQuestion()', () => {
	test('add question with no title', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('', 'sampledescription','sampleimagenilk',1) )
			.rejects.toEqual( Error('missing title') )
		done()
	})

	test('add question with no description', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', '','sampleimagenilk',1) )
			.rejects.toEqual( Error('missing description') )
		done()
	})

	test('add question with no title nor description', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('', '','sampleimagenilk',1) )
			.rejects.toEqual( Error('missing title and description') )
		done()
	})

	test('add question with no logging in', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk') )
			.rejects.toEqual( Error('you need to be logged in to add questions') )
		done()
	})

	test('add question with user id not a number', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk','userid') )
			.rejects.toEqual( Error('user id must be a number') )
		done()
	})

	test('add a valid question', async done => {
		expect.assertions(1)
		const question = await new Questions()
		const add = await question.addQuestion('sampletitle', 'sampledescription', 'sampleimagenilk',1)
		expect(add).toBe(true)
		done()
	})

})

describe('getQuestion()', () => {
	test('get the questions', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk', 1)
		const results = await question.getQuestion()
		expect(results).toEqual({"addedbyuserid": 1, "description": "sampledescription", "id": 1, "imagelink": "sampleimagenilk", "solved": 0, "title": "sampletitle"})
		done()
	})

})

describe('getCommentByIdQuestion()', () => {
	test('get comments by id of the question', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.addComment(1, 'sampledescription', 1)
		await account.addComment(1, 'sampledesc', 1)
		await account.addComment(2, 'samp', 1)
		const results = await account.getCommentByIdQuestion(1)
		expect(results).toEqual({"addedbyuserid": 1, "content": "sampledescription", "id": 1, "iscorrect": 0, "questionsid": 1})
		done()
	})

	test('get a comment by id not a number', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.getCommentByIdQuestion('sample') )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

})

describe('addComment()', () => {
	test('add a valid comment', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const add = await account.addComment(1, 'samplecontent', 1)
		expect(add).toBe(true)
		done()
	})

	test('add a comment with no content', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.addComment(1, '', 1) )
			.rejects.toEqual( Error('missing content of the question') )
		done()
	})

	test('add a comment with no logging in', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.addComment(1, 'samplecontent') )
			.rejects.toEqual( Error('you need to be logged in to add comments') )
		done()
	})
	
	test('add a comment with question id not a number', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.addComment('questionid', 'content', 1) )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('add a comment with no user who added the question not a number', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.addComment(1, 'content', 'addedbyuserid') )
			.rejects.toEqual( Error('user id must be a number') )
		done()
	})

})

describe('updateCommentIsCorrect()', () => {
	test('update a valid comment', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.addComment(1, 'sample', 1)
		const update = await account.updateCommentIsCorrect(1, 1, 1)
		expect(update).toBe(true)
		done()
	})

	test('update a comment as an unauthorised user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.addComment(1, 'sample', 1)
		await expect( account.updateCommentIsCorrect(1, 1, 2) )
			.rejects.toEqual( Error('you are not the user who added the question') )
		done()
	})

	test('update a comment as a not logged in user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.addComment(2, 3, 1)
		await expect( account.updateCommentIsCorrect(1, 1) )
			.rejects.toEqual( Error('you are not logged in') )
		done()
	})

	test('update a comment where question id is not a number', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.updateCommentIsCorrect('questionid', 1, 1) )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('update a comment where user who added the question  is not a number', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.updateCommentIsCorrect(1, 'addedbyuserid', 1) )
			.rejects.toEqual( Error('user id who added the question must be a number') )
		done()
	})

})

describe('addRate()', () => {
	test('add a valid rate', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const add = await account.addRate(1, 1, 2)
		expect(add).toBe(true)
		done()
	})

	test('add too low rate', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.addRate(1, 1, 0) )
			.rejects.toEqual( Error('the minimum rate value is 1') )
		done()
	})

	test('add too big rate', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.addRate(1, 1, 6) )
			.rejects.toEqual( Error('the maximum rate value is 5') )
		done()
	})

	test('add no rate', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.addRate(1, 1) )
			.rejects.toEqual( Error('missing rate value') )
		done()
	})
	
	test('adding a rate where question id is not a number', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.addRate('question', 1, 1) )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('adding a rate where comment id is not a number', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.addRate(1, 'commentid', 1) )
			.rejects.toEqual( Error('comment id must be a number') )
		done()
	})

})