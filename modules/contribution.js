'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Contribution {

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

    async takeFivePointsOff(userid) {
		try {
            if(userid == null) throw new Error('userid cannot be null')
			if(userid.length === 0) throw new Error('missing user id')
            if(isNaN(userid) == true) throw new Error('user id must be a number')
            if(userid % 1 != 0) throw new Error('userid must be an integer')
            if(userid < 1) throw new Error('user id must be bigger than 1')
            let checkUsernameSql = `SELECT COUNT(id) as records FROM users WHERE id = ${userid};`
            let result = await this.db.get(checkUsernameSql)
            if(result.records === 0) throw new Error('user has not been found')
			let sql = `UPDATE users SET contribution = contribution - 5 WHERE id = ${userid};`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
    }
    
    async addFiftyPoints(userid) {
		try {
            if(userid == null) throw new Error('userid cannot be null')
			if(userid.length === 0) throw new Error('missing user id')
            if(isNaN(userid) == true) throw new Error('user id must be a number')
            if(userid % 1 != 0) throw new Error('userid must be an integer')
            if(userid < 1) throw new Error('user id must be bigger than 1')
            let checkUsernameSql = `SELECT COUNT(id) as records FROM users WHERE id = ${userid};`
            let result = await this.db.get(checkUsernameSql)
            if(result.records === 0) throw new Error('user has not been found')
			let sql = `UPDATE users SET contribution = contribution + 50 WHERE id = ${userid};`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
    }
    
    async updateStars() {
		try {
            let assignNone = `UPDATE users SET badge = "none";`

            let assignBronze = `UPDATE users SET badge = "bronze" WHERE 
                id IN 
                    (SELECT id FROM users ORDER BY contribution DESC LIMIT 
                        (SELECT COUNT(id) / 2 as results FROM users)
                    )`

            let assignSilver = `UPDATE users SET badge = "silver" WHERE 
                id IN 
                    (SELECT id FROM users ORDER BY contribution DESC LIMIT 
                        (SELECT COUNT(id) / 4 as results FROM users)
                    )`

            let assignGold = `UPDATE users SET badge = "gold" WHERE 
                id IN 
                    (SELECT id FROM users ORDER BY contribution DESC LIMIT 
                        (SELECT COUNT(id) / 20 as results FROM users)
                    )`
            await this.db.run(assignNone)
            await this.db.run(assignBronze)
            await this.db.run(assignSilver)
            await this.db.run(assignGold)
            return true
            
		} catch(err) {
			throw err
		}
	}
    
}