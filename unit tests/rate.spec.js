'use strict'

const Rates = require('../modules/rate.js')

describe('addRate()', () => {

	test('add a valid rate', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		const add = await rate.addRate(1, 1, 1, 1, 2)
		expect(add).toBe(true)
		done()
	})

	test('add too low rate', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 0, 1, 2) )
			.rejects.toEqual( Error('the minimum rate value is 1') )
		done()
	})

	test('add too big rate', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 6, 1, 2) )
			.rejects.toEqual( Error('the maximum rate value is 5') )
		done()
	})

	test('add no rate', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, null, 1, 2) )
			.rejects.toEqual( Error('missing rate value') )
		done()
    })
    
    test('add a rate which is not an integer number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1.4, 1, 2) )
			.rejects.toEqual( Error('the rate must be an integer') )
		done()
	})
	
	test('adding a rate where question id is not a number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate('question', 1, 1, 1, 2) )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('adding a rate where question id is a special sign', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate('#', 1, 1, 1, 2) )
			.rejects.toEqual( Error('question id must be a number') )
		done()
	})

	test('adding a rate where comment id is not a number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 'commentid', 1, 1, 2) )
			.rejects.toEqual( Error('comment id must be a number') )
		done()
	})
	
	test('adding a rate where comment id is a special sign', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, '#', 1, 1, 2) )
			.rejects.toEqual( Error('comment id must be a number') )
		done()
    })
    
    test('adding a rate where user id is not a number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, 'userid', 2) )
			.rejects.toEqual( Error('user id must be a number') )
		done()
	})
	
	test('adding a rate where user id is a special sign', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, '#', 2) )
			.rejects.toEqual( Error('user id must be a number') )
		done()
    })
    
    test('adding a rate to users own answer', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, 1, 1) )
			.rejects.toEqual( Error('you cannot rate your own answer') )
		done()
    })
    
    test('adding a rate where rate is not a number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 'rate', 1, 1) )
			.rejects.toEqual( Error('rate must be a number') )
		done()
	})
	
	test('adding a rate where rate is a special sign', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, '#', 1, 1) )
			.rejects.toEqual( Error('rate must be a number') )
		done()
    })
    
    test('adding a rate where current user id is not a number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, 1, 'currentuser') )
			.rejects.toEqual( Error('currentuser id must be a number') )
		done()
	})

	test('adding a rate where current user id is a special sign', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, 1, '#') )
			.rejects.toEqual( Error('currentuser id must be a number') )
		done()
	})

	test('add questionsid which is not an integer number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1.2, 1, 1, 1, 2) )
			.rejects.toEqual( Error('questionsid must be an integer') )
		done()
	})

	test('add commentsid which is not an integer number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1.2, 1, 1, 2) )
			.rejects.toEqual( Error('commentsid must be an integer') )
		done()
	})

	test('add addedbyuser which is not an integer number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, 1.2, 2) )
			.rejects.toEqual( Error('addedbyuser must be an integer') )
		done()
	})

	test('add currentuser which is not an integer number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, 1, 2.2) )
			.rejects.toEqual( Error('currentuser must be an integer') )
		done()
	})

	test('add no questionsid', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(null, 1, 1, 1, 2) )
			.rejects.toEqual( Error('missing questionsid value') )
		done()
	})
	
	test('add no commentsid', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, null, 1, 1, 2) )
			.rejects.toEqual( Error('missing commentsid value') )
		done()
	})
	
	test('add no addedbyuser', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, null, 2) )
			.rejects.toEqual( Error('missing addedbyuser value') )
		done()
	})
	
	test('add no currentuser', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, 1, null) )
			.rejects.toEqual( Error('missing currentuser value') )
		done()
	})
	
	test('add questionsid as a negative number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(-1, 1, 1, 1, 1) )
			.rejects.toEqual( Error('question id must be bigger than 1') )
		done()
	})
	
	test('add commentsid as a negative number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, -1, 1, 1, 1) )
			.rejects.toEqual( Error('comments id must be bigger than 1') )
		done()
	})
	
	test('add addedbyuser as a negative number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, -1, 1) )
			.rejects.toEqual( Error('addedbyuser id must be bigger than 1') )
		done()
	})
	
	test('add currentuser as a negative number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, 1, -1) )
			.rejects.toEqual( Error('currentuser id must be bigger than 1') )
		done()
	})
	
	test('add questionsid as a zero length', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate('', 1, 1, 1, 1) )
			.rejects.toEqual( Error('missing questionsid') )
		done()
	})

	test('add commentsid as a zero length', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, '', 1, 1, 1) )
			.rejects.toEqual( Error('missing commentsid') )
		done()
	})

	test('add rate as a zero length', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, '', 1, 1) )
			.rejects.toEqual( Error('missing rate') )
		done()
	})

	test('add addedbyuser as a zero length', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, '', 1) )
			.rejects.toEqual( Error('missing addedbyuser') )
		done()
	})

	test('add currentuser as a zero length', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, 1, '') )
			.rejects.toEqual( Error('missing currentuser') )
		done()
	})

})