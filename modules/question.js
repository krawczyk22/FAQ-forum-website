'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Question {

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

    async uploadQuestionImage(path, mimeType, question) {
		const extension = mime.extension(mimeType)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		await fs.copy(path, `public/questionimages/${question}.${extension}`)
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

}