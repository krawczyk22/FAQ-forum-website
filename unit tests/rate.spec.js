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
	
	test('adding a rate where question id is not a number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate('question', 1, 1, 1, 2) )
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
    
    test('adding a rate where user id is not a number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 1, 'userid', 2) )
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
    
    test('adding a rate where rate is a number', async done => {
		expect.assertions(1)
		const rate = await new Rates()
		await expect( rate.addRate(1, 1, 'rate', 1, 1) )
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

})