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
		await expect( contribution.takeFivePointsOff(0) )
			.rejects.toEqual( Error('user has not been found') )
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
    
    test('perform the operation with user id that does not exist', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
		await expect( contribution.addFiftyPoints(0) )
			.rejects.toEqual( Error('user has not been found') )
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