'use strict'

const Contribution = require('../modules/contribution.js')
const Accounts = require('../modules/user.js')

describe('takeFivePointsOff()', () => {

	test('perform a valid operation', async done => {
		expect.assertions(1)
        const contribution = await new Contribution()
        const account = await new Accounts()
        await account.register('doej', 'password')
		const substract = await contribution.takeFivePointsOff(1)
		expect(substract).toBe(true)
		done()
    })
    
    test('perform the operation with no user id', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.takeFivePointsOff('') )
			.rejects.toEqual( Error('missing user id') )
		done()
	})
	
	test('perform the operation with user id as null', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.takeFivePointsOff(null) )
			.rejects.toEqual( Error('userid cannot be null') )
		done()
	})
	test('perform the operation with user id as a special sign', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.takeFivePointsOff('#') )
			.rejects.toEqual( Error('user id must be a number') )
		done()
	})
	
	test('perform the operation with user id as negative number', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.takeFivePointsOff(-1) )
			.rejects.toEqual( Error('user id must be bigger than 1') )
		done()
    })
    
    test('perform the operation with user id as a string', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.takeFivePointsOff('userid') )
			.rejects.toEqual( Error('user id must be a number') )
		done()
    })
    
    test('perform the operation with user id that does not exist', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.takeFivePointsOff(999999999999999999999) )
			.rejects.toEqual( Error('user has not been found') )
		done()
	})

	test('perform the operation with user id that is not an integer', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.takeFivePointsOff(1.5) )
			.rejects.toEqual( Error('userid must be an integer') )
		done()
	})

})

describe('addFiftyPoints()', () => {

	test('perform a valid operation', async done => {
		expect.assertions(1)
        const contribution = await new Contribution()
        const account = await new Accounts()
        await account.register('doej', 'password')
		const substract = await contribution.addFiftyPoints(1)
		expect(substract).toBe(true)
		done()
    })
    
    test('perform the operation with no user id', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.addFiftyPoints('') )
			.rejects.toEqual( Error('missing user id') )
		done()
    })
    
    test('perform the operation with user id as a string', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.addFiftyPoints('userid') )
			.rejects.toEqual( Error('user id must be a number') )
		done()
	})
	
	test('perform the operation with user id as a special sign', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.addFiftyPoints('#') )
			.rejects.toEqual( Error('user id must be a number') )
		done()
	})

	test('perform the operation with user id as a negative number', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.addFiftyPoints(-1) )
			.rejects.toEqual( Error('user id must be bigger than 1') )
		done()
	})
	
	test('perform the operation with user id as null', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.addFiftyPoints(null) )
			.rejects.toEqual( Error('userid cannot be null') )
		done()
    })
    
    test('perform the operation with user id that does not exist', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.addFiftyPoints(999999999999999999999) )
			.rejects.toEqual( Error('user has not been found') )
		done()
	})

	test('perform the operation with user id that is not an integer', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.addFiftyPoints(1.5) )
			.rejects.toEqual( Error('userid must be an integer') )
		done()
	})

})

describe('updateStars()', () => {
    
	test('update the badges to none, bronze, silver and gold', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		const results = await contribution.updateStars()
		expect(results).toBe(true)
		done()
	})
})