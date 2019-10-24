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
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, contribution INT DEFAULT 0);'
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

	async updateCommentIsCorrect(questionsid, commentid, addedbyuserid, currentuser) {
		try {
			if(isNaN(questionsid) == true) throw new Error('question id must be a number')
			if(isNaN(addedbyuserid) == true) throw new Error('user id who added the question must be a number')
			if(currentuser == null) throw new Error('you are not logged in')
			if(currentuser != addedbyuserid) throw new Error('you are not the user who added the question')
			if(isNaN(currentuser) == true) throw new Error('current user id must be a number')
			let sqlcheck = `SELECT COUNT(id) AS records FROM comments WHERE questionsid = ${questionsid} AND iscorrect = true;`
			const check = await this.db.get(sqlcheck)
			if(check.records !==0 ) throw new Error('the correct answer has already been chosen')
			let sql = `UPDATE comments SET iscorrect = true WHERE questionsid = ${questionsid} AND id = ${commentid};`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
}
