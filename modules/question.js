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
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, contribution INT DEFAULT 0, badge TEXT DEFAULT "none");'
			await this.db.run(sql)
			const sql2 = 'CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, imagelink TEXT, solved BOOLEAN, addedbyuserid INT);'
			await this.db.run(sql2)
			const sql3 = 'CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, questionsid INT, addedbyuserid INT, content TEXT, iscorrect BOOLEAN);'
			await this.db.run(sql3)
			const sql4 = 'CREATE TABLE IF NOT EXISTS rates (id INTEGER PRIMARY KEY AUTOINCREMENT, questionsid INT, commentsid INT, rate INT, addedbyuser INT);'
			await this.db.run(sql4)
			return this
		})()
	}

    async uploadQuestionImage(path, mimeType, question) {
		const extension = mime.extension(mimeType)
		await fs.copy(path, `public/questionimages/${question}.${extension}`)
    }
    
    async addQuestion(title, description, imagelink, addedbyuserid) {
		try {
			if(title == null) throw new Error('title cannot be null')
			if(description == null) throw new Error('description cannot be null')
			if(imagelink == null) throw new Error('imagelink cannot be null')
			if(addedbyuserid == null) throw new Error('you need to be logged in to add questions')

			if(title.length === 0 && description.length === 0) throw new Error('missing title and description')
			if(title.length === 0) throw new Error('missing title')
			if(description.length === 0) throw new Error('missing description')

			if(title.length < 8) throw new Error('title must be 8 characters long')
			if(description.length < 8) throw new Error('description must be 8 characters long')

			if(addedbyuserid.length === 0) throw new Error('missing addedbyuserid')
			if(isNaN(addedbyuserid) == true) throw new Error('user id must be a number')
			if(addedbyuserid % 1 != 0) throw new Error('addedbyuserid must be an integer')
			if(addedbyuserid < 1) throw new Error('addedbyuserid must be bigger than 1')
			let sql = `INSERT INTO questions(title, description, imagelink, solved, addedbyuserid) VALUES("${title}", "${description}", "${imagelink}", false, "${addedbyuserid}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async updateQuestionIsSolved(questionid) {
		try {
			if(questionid == null) throw new Error('questionid cannot be null')
			if(questionid.length === 0) throw new Error('missing question')
			if(isNaN(questionid) == true) throw new Error('question id must be a number')
			if(questionid % 1 != 0) throw new Error('questionid must be an integer')
			if(questionid < 1) throw new Error('question id must be bigger than 1')
			let sqlCheck = `SELECT COUNT(*) as records FROM questions WHERE id = ${questionid};`
			const recordsCheck = await this.db.get(sqlCheck)
			if(recordsCheck.records == 0) throw new Error(`question with the id "${questionid}" is not found`)
			let sql = `UPDATE questions SET solved = true WHERE id = ${questionid};`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async getQuestion(questionid) {
		try {
			if(questionid == null) throw new Error('questionid cannot be null')
			if(questionid.length === 0) throw new Error('missing question')
			if(isNaN(questionid) == true) throw new Error('question id must be a number')
			if(questionid % 1 != 0) throw new Error('questionid must be an integer')
			if(questionid < 1) throw new Error('question id must be bigger than 1')
			let sqlCheck = `SELECT COUNT(*) as records FROM questions WHERE id = ${questionid};`
			const recordsCheck = await this.db.get(sqlCheck)
			if(recordsCheck.records == 0) throw new Error(`question with the id "${questionid}" is not found`)
			let sql = `SELECT id, title, description, imagelink FROM questions WHERE id = ${questionid};`
			const records = await this.db.get(sql)
			return records
		} catch(err) {
			throw err
		}
	}

}