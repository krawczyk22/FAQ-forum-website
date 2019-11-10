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

	test('add question with user id smaller than 1', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', 'samplecdescription','sampleimagenilk',-1) )
			.rejects.toEqual( Error('addedbyuserid must be bigger than 1') )
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

	test('add question with title as null', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion(null, 'sampledescription','sampleimagenilk', 1) )
			.rejects.toEqual( Error('title cannot be null') )
		done()
	})

	test('add question with description as null', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', null,'sampleimagenilk', 1) )
			.rejects.toEqual( Error('description cannot be null') )
		done()
	})

	test('add question with imagelink as null', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', 'sampledescription' , null, 1) )
			.rejects.toEqual( Error('imagelink cannot be null') )
		done()
	})

	test('add question with addedbyuserid as length zero', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect( question.addQuestion('sampletitle', 'sampledescription' , 'sampleimagelink', '') )
			.rejects.toEqual( Error('missing addedbyuserid') )
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
    
	test('get the question', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk', 1)
		const results = await question.getQuestion(1)
		expect(results).toEqual({"description": "sampledescription", "id": 1, "imagelink": "sampleimagenilk", "title": "sampletitle"})
		done()
	})

	test('get the question from null value', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk', 1)
		await expect( question.getQuestion(null) )
			.rejects.toEqual( Error('questionid cannot be null') )
		done()
	})

	test('get the question from negative value', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk', 1)
		await expect( question.getQuestion(-1) )
			.rejects.toEqual( Error('question id must be bigger than 1') )
		done()
	})

	test('get the question from no value', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk', 1)
		await expect( question.getQuestion('') )
			.rejects.toEqual( Error('missing question') )
		done()
	})

	test('get the question from value that is not a number', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk', 1)
		await expect( question.getQuestion('number') )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('get the question from value that is a special sign', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk', 1)
		await expect( question.getQuestion('#') )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('get the question from value that is not an integer', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk', 1)
		await expect( question.getQuestion(1.5) )
			.rejects.toEqual( Error('questionid must be an integer') )
		done()
	})

	test('get the question from value that does not exist', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('sampletitle', 'sampledescription','sampleimagenilk', 1)
		await expect( question.getQuestion(9999999999999) )
			.rejects.toEqual( Error('question with the id "9999999999999" is not found') )
		done()
	})

})