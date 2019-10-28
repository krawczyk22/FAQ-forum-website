
'use strict'

const Comments = require('../modules/comment.js')

describe('getCommentByIdQuestion()', () => {

	test('get comments by id of the question', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await comment.addComment(1, 'sampledescription', 1)
		await comment.addComment(1, 'sampledesc', 1)
		await comment.addComment(2, 'samp', 1)
		const results = await comment.getCommentByIdQuestion(1)
		expect(results).toEqual({"addedbyuserid": 1, "content": "sampledescription", "id": 1, "iscorrect": 0, "questionsid": 1})
		done()
	})

	test('get a comment by id not a number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.getCommentByIdQuestion('sample') )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

})

describe('addComment()', () => {

	test('add a valid comment', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		const add = await comment.addComment(1, 'samplecontent', 1)
		expect(add).toBe(true)
		done()
	})

	test('add a comment with no content', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, '', 1) )
			.rejects.toEqual( Error('missing content of the question') )
		done()
	})

	test('add a comment with no logging in', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, 'samplecontent') )
			.rejects.toEqual( Error('you need to be logged in to add comments') )
		done()
	})
	
	test('add a comment with question id not a number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment('questionid', 'content', 1) )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('add a comment with no user who added the question not a number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, 'content', 'addedbyuserid') )
			.rejects.toEqual( Error('user id must be a number') )
		done()
	})

	test('add a comment to question where question id is not an integer', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1.5, 'content', 1) )
			.rejects.toEqual( Error('question id must be an integer') )
		done()
	})

	test('aadd a comment to question where question id is not an integer', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, 'content', 1.5) )
			.rejects.toEqual( Error('user id must be an integer') )
		done()
	})

})

describe('updateCommentIsCorrect()', () => {
    
	test('update a valid comment', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await comment.addComment(1, 'sample', 1)
		const update = await comment.updateCommentIsCorrect(1, 1, 1, 1)
		expect(update).toBe(true)
		done()
	})

	test('update a comment as an unauthorised user', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await comment.addComment(1, 'sample', 1)
		await expect( comment.updateCommentIsCorrect(1, 1, 2, 1) )
			.rejects.toEqual( Error('you are not the user who added the question') )
		done()
	})

	test('update a comment as a not logged in user', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await comment.addComment(2, 3, 1)
		await expect( comment.updateCommentIsCorrect(1, 1, 1, null) )
			.rejects.toEqual( Error('you are not logged in') )
		done()
	})

	test('update a comment where question id is not a number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect('questionid', 1, 1, 1) )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('update a comment where user who added the question is not a number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, 'addedbyuser', 1) )
			.rejects.toEqual( Error('user id who added the question must be a number') )
		done()
	})

	test('update a comment where user who tries to update the question is not a number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, 1, 'currentuser') )
			.rejects.toEqual( Error('current user id must be a number') )
		done()
	})

    test('update a comment that has alreay been updated', async done => {
		expect.assertions(1)
        const comment = await new Comments()
        await comment.addComment(1, 'sample', 1)
        await comment.updateCommentIsCorrect(1, 1, 1, 1)
		await expect( comment.updateCommentIsCorrect(1, 1, 1, 1) )
			.rejects.toEqual( Error('the correct answer has already been chosen') )
		done()
    })
	
})