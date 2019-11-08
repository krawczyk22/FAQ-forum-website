
'use strict'

const Accounts = require('../modules/user.js')

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

	test('error if username is less than 4 characters long', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doe', '') )
			.rejects.toEqual( Error('username must be at least 4 characters long') )
		done()
	})

	test('error if password is less than 8 characters long', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'qwe') )
			.rejects.toEqual( Error('password must be at least 8 characters long') )
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

	test('log in with valid credentials and special signs', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'pa$$w£#.?')
		const valid = await account.login('doej', 'pa$$w£#.?')
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
		await expect( account.login('doej', 'badpassword') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

	test('error if username is less than 4 characters long', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		await expect( account.login('doe', 'badpassword') )
			.rejects.toEqual( Error('username must be at least 4 characters long') )
		done()
	})

	test('error if password is less than 8 characters long', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('password must be at least 8 characters long') )
		done()
	})

})