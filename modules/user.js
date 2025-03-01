
'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, contribution INT DEFAULT 0, badge TEXT DEFAULT "none");'
			await this.db.run(sql)
			const sql2 = 'CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, imagelink TEXT, solved BOOLEAN, addedbyuserid INT, dateadded TEXT);'
			await this.db.run(sql2)
			const sql3 = 'CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, questionsid INT, addedbyuserid INT, content TEXT, iscorrect BOOLEAN);'
			await this.db.run(sql3)
			const sql4 = 'CREATE TABLE IF NOT EXISTS rates (id INTEGER PRIMARY KEY AUTOINCREMENT, questionsid INT, commentsid INT, rate INT, addedbyuser INT);'
			await this.db.run(sql4)
			return this
		})()
	}

	async register(user, pass) {
		try {
			if(user == null && pass == null) throw new Error('username and password cannot be null')
			if(user == null) throw new Error('username cannot be null')
			if(pass == null) throw new Error('password cannot be null')

			if(user.length === 0 && pass.length === 0) throw new Error('missing username and password')
			if(user.length === 0) throw new Error('missing username')
			if(pass.length === 0) throw new Error('missing password')

			if(user.length < 4) throw new Error('username must be at least 4 characters long')
			if(pass.length < 8) throw new Error('password must be at least 8 characters long')

			if(user.length > 20) throw new Error('username cannot contain more than 20 characters')
			if(pass.length > 20) throw new Error('password cannot contain more than 20 characters')

			let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`username "${user}" already in use`)

			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO users(user, pass) VALUES("${user}", "${pass}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async uploadPicture(path, mimeType, username) {
		const extension = mime.extension(mimeType)
		await fs.copy(path, `public/avatars/${username}.${extension}`)
	}

	async login(username, password) {
		try {
			if(username == null && password == null) throw new Error('username and password cannot be null')
			if(username == null) throw new Error('username cannot be null')
			if(password == null) throw new Error('password cannot be null')

			if(username.length === 0 && password.length === 0) throw new Error('missing username and password')
			if(username.length === 0) throw new Error('missing username')
			if(password.length === 0) throw new Error('missing password')

			if(username.length < 4) throw new Error('username must be at least 4 characters long')
			if(password.length < 8) throw new Error('password must be at least 8 characters long')

			if(username.length > 20) throw new Error('username cannot contain more than 20 characters')
			if(password.length > 20) throw new Error('password cannot contain more than 20 characters')

			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${username}" not found`)

			sql = `SELECT pass FROM users WHERE user = "${username}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.pass)
			if(valid === false) throw new Error(`invalid password for account "${username}"`)

			sql = `SELECT id FROM users WHERE user = "${username}";`
			const iduser = await this.db.get(sql)
			return iduser.id
		} catch(err) {
			throw err
		}
	}
}