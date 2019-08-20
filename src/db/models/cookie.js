/**
 * db/models/cookie.js
 * 
 * @description Model do collection de cookie de autenticação
 */

const mongoose = require('mongoose')

module.exports = mongoose.model('Cookie', {
	matricula: {
		type: String,
		required: true,
		unique: true
	},
	sessionID: {
		type: String,
		required: true,
		unique: true
	},
	date: {
		type: Date,
		required: true
	}
})
