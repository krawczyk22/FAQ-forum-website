
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
		await expect( account.register('doe', 'password') )
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

	test('error if username is null', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register(null, 'qwerty') )
			.rejects.toEqual( Error('username cannot be null') )
		done()
	})

	test('error if password is null', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('username', null) )
			.rejects.toEqual( Error('password cannot be null') )
		done()
	})

	test('error if username and password are null', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register(null, null) )
			.rejects.toEqual( Error('username and password cannot be null') )
		done()
	})

	test('error if username is longer than 20 characters', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('qwertqwertqwertqwertqwertqwert', 'password') )
			.rejects.toEqual( Error('username cannot contain more than 20 characters') )
		done()
	})

	test('error if password is longer than 20 characters', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('username', 'qwertqwertqwertqwertqwertqwert') )
			.rejects.toEqual( Error('password cannot contain more than 20 characters') )
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
		expect(valid).toEqual(1)
		done()
	})

	test('log in with valid credentials and special signs', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'pa$$w£#.?')
		const valid = await account.login('doej', 'pa$$w£#.?')
		expect(valid).toEqual(1)
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
	test('error if username is null', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.login(null, 'qwerty') )
			.rejects.toEqual( Error('username cannot be null') )
		done()
	})

	test('error if password is null', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.login('username', null) )
			.rejects.toEqual( Error('password cannot be null') )
		done()
	})

	test('error if username and password are null', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.login(null, null) )
			.rejects.toEqual( Error('username and password cannot be null') )
		done()
	})

	test('error if blank username and password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.login('', '') )
			.rejects.toEqual( Error('missing username and password') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.login('', 'password') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.login('doej', '') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

	test('error if username is longer than 20 characters', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.login('qwertqwertqwertqwertqwertqwert', 'password') )
			.rejects.toEqual( Error('username cannot contain more than 20 characters') )
		done()
	})

	test('error if password is longer than 20 characters', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.login('username', 'qwertqwertqwertqwertqwertqwert') )
			.rejects.toEqual( Error('password cannot contain more than 20 characters') )
		done()
	})

})