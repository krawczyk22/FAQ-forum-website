'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Comment {

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

    async addComment(questionsid, content, addedbyuserid) {
		try {
			if(content.length === 0) throw new Error('missing content of the question')
			if(addedbyuserid == null) throw new Error('you need to be logged in to add comments')
			if(questionsid == null) throw new Error('questionsid cannot be null')

			if(isNaN(questionsid) == true) throw new Error('question id must be a number')
			if(isNaN(addedbyuserid) == true) throw new Error('user id must be a number')

			if(questionsid < 1) throw new Error('question id must be bigger than 1')
			if(addedbyuserid < 1) throw new Error('user id must be bigger than 1')

			if(questionsid % 1 != 0) throw new Error('question id must be an integer')
			if(addedbyuserid % 1 != 0) throw new Error('user id must be an integer')
			let sql = `INSERT INTO comments(questionsid, addedbyuserid, iscorrect, content) VALUES(${questionsid}, ${addedbyuserid}, false, "${content}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async getCommentByIdQuestion(questionsid) {
		try {
			if(questionsid == null) throw new Error('question id cannot be null')
			if(isNaN(questionsid) == true) throw new Error('question id must be a number')
			if(questionsid % 1 != 0) throw new Error('question id must be an integer')
			if(questionsid < 1) throw new Error('question id must be bigger than 1')
			let sqlCheck = `SELECT COUNT(*) as records FROM comments WHERE questionsid = ${questionsid};`
			const recordsCheck = await this.db.get(sqlCheck)
			if(recordsCheck.records == 0) throw new Error(`comment with the id "${questionsid}" is not found`)
			let sql = `SELECT * FROM comments WHERE questionsid = ${questionsid};`
			const records = await this.db.get(sql)
			return records
		} catch(err) {
			throw err
		}
	}

	async updateCommentIsCorrect(questionsid, commentid, addedbyuserid, currentuser) {
		try {
			if(isNaN(questionsid) == true) throw new Error('question id must be a number')
			if(isNaN(addedbyuserid) == true) throw new Error('user id who added the question must be a number')
			if(isNaN(currentuser) == true) throw new Error('current user id must be a number')
			if(isNaN(commentid) == true) throw new Error('comment id must be a number')

			if(questionsid == null) throw new Error('questionsid cannot be null')
			if(commentid == null) throw new Error('commentid cannot be null')
			if(addedbyuserid == null) throw new Error('addedbyuserid cannot be null')
			if(currentuser == null) throw new Error('you are not logged in')

			if(questionsid % 1 != 0) throw new Error('question id must be an integer')
			if(commentid % 1 != 0) throw new Error('commentid must be an integer')
			if(addedbyuserid % 1 != 0) throw new Error('addedbyuserid must be an integer')
			if(currentuser % 1 != 0) throw new Error('currentuser must be an integer')

			if(questionsid < 1) throw new Error('question id must be bigger than 1')
			if(commentid < 1) throw new Error('comment id must be bigger than 1')
			if(addedbyuserid < 1) throw new Error('addedbyuser id must be bigger than 1')
			if(currentuser < 1) throw new Error('currentuser must be bigger than 1')

			if(currentuser != addedbyuserid) throw new Error('you are not the user who added the question')

			let sqlcheck = `SELECT COUNT(id) AS records FROM comments WHERE questionsid = ${questionsid} AND iscorrect = true;`
			const check = await this.db.get(sqlcheck)
			if(check.records !== 0 ) throw new Error('the correct answer has already been chosen')
			let sql = `UPDATE comments SET iscorrect = true WHERE questionsid = ${questionsid} AND id = ${commentid};`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
}
