
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
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT);'
			await this.db.run(sql)
			const sql2 = 'CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, imagelink TEXT, solved BOOLEAN, addedbyuserid INT);'
			await this.db.run(sql2)
			const sql3 = 'CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, questionsid INT, addedbyuserid INT, content TEXT, iscorrect BOOLEAN);'
			await this.db.run(sql3)
			const sql4 = 'CREATE TABLE IF NOT EXISTS rates (id INTEGER PRIMARY KEY AUTOINCREMENT, questionsid INT, commentsid INT, rate INT);'
			await this.db.run(sql4)
			return this
		})()
	}

	async register(user, pass) {
		try {
			if(user.length === 0 && pass.length === 0) throw new Error('missing username and password')
			if(user.length === 0) throw new Error('missing username')
			if(pass.length === 0) throw new Error('missing password')
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

	async uploadPicture(path, mimeType) {
		const extension = mime.extension(mimeType)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		//await fs.copy(path, `public/avatars/${username}.${fileExtension}`)
	}

	async login(username, password) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${username}" not found`)
			sql = `SELECT pass FROM users WHERE user = "${username}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.pass)
			if(valid === false) throw new Error(`invalid password for account "${username}"`)
			return true
		} catch(err) {
			throw err
		}
	}

	async addQuestion(title, description, imagelink, addedbyuserid) {
		try {
			if(title.length === 0 && description.length === 0) throw new Error('missing title and description')
			if(title.length === 0) throw new Error('missing title')
			if(description.length === 0) throw new Error('missing description')
			if(addedbyuserid == null) throw new Error('you need to be logged in to add questions')
			if(isNaN(addedbyuserid) == true) throw new Error('user id must be a number')
			let sql = `INSERT INTO questions(title, description, imagelink, solved, addedbyuserid) VALUES("${title}", "${description}", "${imagelink}", false, "${addedbyuserid}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async getQuestion() {
		try {
			let sql = `SELECT * FROM questions;`
			const records = await this.db.get(sql)
			return records
		} catch(err) {
			throw err
		}
	}

	async addComment(questionsid, content, addedbyuserid) {
		try {
			if(content.length === 0) throw new Error('missing content of the question')
			if(addedbyuserid == null) throw new Error('you need to be logged in to add comments')
			if(isNaN(questionsid) == true) throw new Error('question id must be a number')
			if(isNaN(addedbyuserid) == true) throw new Error('user id must be a number')
			let sql = `INSERT INTO comments(questionsid, addedbyuserid, iscorrect, content) VALUES(${questionsid}, ${addedbyuserid}, false, "${content}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async getCommentByIdQuestion(questionsid) {
		try {
			if(isNaN(questionsid) == true) throw new Error('question id must be a number')
			let sql = `SELECT * FROM comments WHERE questionsid = ${questionsid};`
			const records = await this.db.get(sql)
			return records
		} catch(err) {
			throw err
		}
	}

	async updateCommentIsCorrect(questionsid, addedbyuserid, currentuser) {
		try {
			if(isNaN(questionsid) == true) throw new Error('question id must be a number')
			if(isNaN(addedbyuserid) == true) throw new Error('user id who added the question must be a number')
			if(currentuser == null) throw new Error('you are not logged in')
			if(currentuser !== addedbyuserid) throw new Error('you are not the user who added the question')
			if(isNaN(currentuser) == true) throw new Error('current user id must be a number')
			let sql = `UPDATE comments SET iscorrect = true WHERE questionsid = ${questionsid};`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async addRate(questionsid, commentsid, rate) {
		try {
			if(isNaN(questionsid) == true) throw new Error('question id must be a number')
			if(isNaN(commentsid) == true) throw new Error('comment id must be a number')
			if(rate == null) throw new Error('missing rate value')
			if(rate > 5) throw new Error('the maximum rate value is 5')
			if(rate < 1) throw new Error('the minimum rate value is 1')
			let sql = `INSERT INTO rates(questionsid, commentsid, rate) VALUES(${questionsid}, ${commentsid}, ${rate});`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
}