'use strict'

const Contribution = require('../modules/contribution.js')

describe('getCommentByIdQuestion()', () => {

	test('perform a valid operation', async done => {
		expect.assertions(1)
		const contribution = await new Contribution()
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

})