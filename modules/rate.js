'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Rate {

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

    async addRate(questionsid, commentsid, rate, addedbyuser, currentuser) {
		try {

			if(isNaN(questionsid) == true) throw new Error('question id must be a number')
			if(isNaN(commentsid) == true) throw new Error('comment id must be a number')
            if(isNaN(addedbyuser) == true) throw new Error('user id must be a number')
            if(isNaN(rate) == true) throw new Error('rate must be a number')
			if(isNaN(currentuser) == true) throw new Error('currentuser id must be a number')
			
			if(questionsid % 1 != 0) throw new Error('questionsid must be an integer')
			if(commentsid % 1 != 0) throw new Error('commentsid must be an integer')
			if(rate % 1 != 0) throw new Error('the rate must be an integer')
			if(addedbyuser % 1 != 0) throw new Error('addedbyuser must be an integer')
			if(currentuser % 1 != 0) throw new Error('currentuser must be an integer')

			if(questionsid == null) throw new Error('missing questionsid value')
			if(commentsid == null) throw new Error('missing commentsid value')
			if(rate == null) throw new Error('missing rate value')
			if(addedbyuser == null) throw new Error('missing addedbyuser value')
			if(currentuser == null) throw new Error('missing currentuser value')

			if(questionsid.length === 0) throw new Error('missing questionsid')
			if(commentsid.length === 0) throw new Error('missing commentsid')
			if(rate.length === 0) throw new Error('missing rate')
			if(addedbyuser.length === 0) throw new Error('missing addedbyuser')
			if(currentuser.length === 0) throw new Error('missing currentuser')

			if(questionsid < 1) throw new Error('question id must be bigger than 1')
			if(commentsid < 1) throw new Error('comments id must be bigger than 1')
			if(addedbyuser < 1) throw new Error('addedbyuser id must be bigger than 1')
			if(currentuser < 1) throw new Error('currentuser id must be bigger than 1')
			if(rate > 5) throw new Error('the maximum rate value is 5')
			if(rate < 1) throw new Error('the minimum rate value is 1')

			if(addedbyuser == currentuser ) throw new Error('you cannot rate your own answer')
			
			let sql = `INSERT INTO rates(questionsid, commentsid, rate, addedbyuser) VALUES(${questionsid}, ${commentsid}, ${rate}, ${addedbyuser});`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
}