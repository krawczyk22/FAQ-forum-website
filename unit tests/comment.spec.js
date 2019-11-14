
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

	test('get a comment by id a special sign', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.getCommentByIdQuestion('#') )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('get a comment by id null', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.getCommentByIdQuestion(null) )
			.rejects.toEqual( Error('question id cannot be null') )
		done()
	})

	test('get a comment by id not an integer', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.getCommentByIdQuestion(1.2) )
			.rejects.toEqual( Error('question id must be an integer') )
		done()
	})

	test('get a comment by id that does not exist', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.getCommentByIdQuestion(9999999999999) )
			.rejects.toEqual( Error('comment with the id "9999999999999" is not found') )
		done()
	})

	test('get a comment by id as a negative number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.getCommentByIdQuestion(-1) )
			.rejects.toEqual( Error('question id must be bigger than 1') )
		done()
	})

	test('get a comment by id as zero length', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.getCommentByIdQuestion('') )
			.rejects.toEqual( Error('missing questionsid of the question') )
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

	test('check if comment is in database', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await comment.addComment(1, 'sampledescription', 1)
		await comment.addComment(1, 'sampledesc', 1)
		await comment.addComment(2, 'samp', 1)
		const results = await comment.getCommentByIdQuestion(1)
		expect(results).toEqual({"addedbyuserid": 1, "content": "sampledescription", "id": 1, "iscorrect": 0, "questionsid": 1})
		done()
	})

	test('add a comment with no content', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, '', 1) )
			.rejects.toEqual( Error('missing content of the question') )
		done()
	})

	test('add a comment which is too big', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, 'qwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwert', 1) )
			.rejects.toEqual( Error('your comment can be 500 characters long only') )
		done()
	})

	test('add a comment with content as null', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, null, 1) )
			.rejects.toEqual( Error('content cannot be null') )
		done()
	})

	test('add a comment with no logging in', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, 'samplecontent') )
			.rejects.toEqual( Error('you need to be logged in to add comments') )
		done()
	})

	test('add a comment with questionsid as null', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(null, 'samplecontent', 1) )
			.rejects.toEqual( Error('questionsid cannot be null') )
		done()
	})
	
	test('add a comment with question id not a number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment('questionid', 'content', 1) )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('add a comment with question id is a special sign', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment('#', 'content', 1) )
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

	test('add a comment with no user who added the question is a special sign', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, 'content', '#') )
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

	test('add a comment to question where user id is not an integer', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, 'content', 1.5) )
			.rejects.toEqual( Error('user id must be an integer') )
		done()
	})

	test('add a comment with questionid as a negative number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(-1, 'content', 1) )
			.rejects.toEqual( Error('question id must be bigger than 1') )
		done()
	})

	test('add a comment with userid as a negative number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, 'content', -1) )
			.rejects.toEqual( Error('user id must be bigger than 1') )
		done()
	})

	test('add a comment with question id zero length', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment('', 'content', 1) )
			.rejects.toEqual( Error('missing questionsid of the question') )
		done()
	})

	test('add a comment with user id zero length', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.addComment(1, 'content', '') )
			.rejects.toEqual( Error('missing addedbyuserid of the question') )
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

	test('update a comment as questionsid is null', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await comment.addComment(2, 3, 1)
		await expect( comment.updateCommentIsCorrect(null, 1, 1, 1) )
			.rejects.toEqual( Error('questionsid cannot be null') )
		done()
	})

	test('update a comment as commentid is null', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await comment.addComment(2, 3, 1)
		await expect( comment.updateCommentIsCorrect(1, null, 1, 1) )
			.rejects.toEqual( Error('commentid cannot be null') )
		done()
	})

	test('update a comment as addedbyuserid is null', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await comment.addComment(2, 3, 1)
		await expect( comment.updateCommentIsCorrect(1, 1, null, 1) )
			.rejects.toEqual( Error('addedbyuserid cannot be null') )
		done()
	})

	test('update a comment where question id is not a number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect('questionid', 1, 1, 1) )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('update a comment where question id is a special sign', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect('#', 1, 1, 1) )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('update a comment where comment id is not a number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 'commentid', 1, 1) )
			.rejects.toEqual( Error('comment id must be a number') )
		done()
	})

	test('update a comment where comment id is a special sign', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, '#', 1, 1) )
			.rejects.toEqual( Error('comment id must be a number') )
		done()
	})

	test('update a comment where user who added the question is not a number', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, 'addedbyuser', 1) )
			.rejects.toEqual( Error('user id who added the question must be a number') )
		done()
	})

	test('update a comment where user who added the question is a special sign', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, '#', 1) )
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

	test('update a comment where user who tries to update the question is a special sign', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, 1, '#') )
			.rejects.toEqual( Error('current user id must be a number') )
		done()
	})

	test('update a comment where question id is not an integer', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1.5, 1, 1, 1) )
			.rejects.toEqual( Error('question id must be an integer') )
		done()
	})

	test('update a comment where commentid is not an integer', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1.5, 1, 1) )
			.rejects.toEqual( Error('commentid must be an integer') )
		done()
	})

	test('update a comment where addedbyuserid is not an integer', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, 1.5, 1) )
			.rejects.toEqual( Error('addedbyuserid must be an integer') )
		done()
	})

	test('update a comment where currentuser is not an integer', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, 1, 1.5) )
			.rejects.toEqual( Error('currentuser must be an integer') )
		done()
	})

	test('update a comment where questionsid is negative', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(-1, 1, 1, 1) )
			.rejects.toEqual( Error('question id must be bigger than 1') )
		done()
	})

	test('update a comment where commentid is negative', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, -1, 1, 1) )
			.rejects.toEqual( Error('comment id must be bigger than 1') )
		done()
	})

	test('update a comment where addedbyuserid is negative', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, -1, 1) )
			.rejects.toEqual( Error('addedbyuser id must be bigger than 1') )
		done()
	})

	test('update a comment where currentuser is negative', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, 1, -1) )
			.rejects.toEqual( Error('currentuser must be bigger than 1') )
		done()
	})

	test('update a comment where questionsid is zero length', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect('', 1, 1, 1) )
			.rejects.toEqual( Error('missing questionsid of the comment') )
		done()
	})

	test('update a comment where commentid is zero length', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, '', 1, 1) )
			.rejects.toEqual( Error('missing commentid of the comment') )
		done()
	})

	test('update a comment where addedbyuserid is zero length', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, '', 1) )
			.rejects.toEqual( Error('missing addedbyuserid of the comment') )
		done()
	})

	test('update a comment where currentuser is zero length', async done => {
		expect.assertions(1)
		const comment = await new Comments()
		await expect( comment.updateCommentIsCorrect(1, 1, 1, '') )
			.rejects.toEqual( Error('missing currentuser of the comment') )
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