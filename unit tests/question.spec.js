'use strict'

const Questions = require('../modules/question.js')

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

	test('add question with user id a special sign', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk','#') )
			.rejects.toEqual( Error('user id must be a number') )
		done()
	})

	test('add question with addedbyuserid not an integer', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk',1.5) )
			.rejects.toEqual( Error('addedbyuserid must be an integer') )
		done()
	})

	test('add question with title that is less than 8 characters long', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sa', 'sampledescription','sampleimagenilk',1) )
			.rejects.toEqual( Error('title must be 8 characters long') )
		done()
	})

	test('add question with description that is less than 8 characters long', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', 'sa','sampleimagenilk',1) )
			.rejects.toEqual( Error('description must be 8 characters long') )
		done()
	})

	test('add question with user id as null', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk',null) )
			.rejects.toEqual( Error('you need to be logged in to add questions') )
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

describe('updateQuestion()', () => {

    test('update question with no id', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.updateQuestionIsSolved('') )
			.rejects.toEqual( Error('missing question') )
		done()
    })
    
    test('update question with string instead if number as an id', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.updateQuestionIsSolved('string') )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('update question with special sign instead of number as an id', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.updateQuestionIsSolved('#') )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('update question with null as an id', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.updateQuestionIsSolved(null) )
			.rejects.toEqual( Error('questionid cannot be null') )
		done()
	})

	test('update question that does not exist', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.updateQuestionIsSolved(9999999999999) )
			.rejects.toEqual( Error('question with the id "9999999999999" is not found') )
		done()
	})

	test('update question with negative number as an id', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.updateQuestionIsSolved(-1) )
			.rejects.toEqual( Error('question id must be bigger than 1') )
		done()
	})
	
	test('update question with questionid is not an integer', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.updateQuestionIsSolved(1.5) )
			.rejects.toEqual( Error('questionid must be an integer') )
		done()
    })
    
    test('update a valid question', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('sampletitle', 'sampledescription', 'sampleimagenilk',1)
		const add = await question.updateQuestionIsSolved(1)
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