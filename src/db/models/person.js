/**
 * db/models/person.js
 * 
 * @description Model da collection de pessoas (people), seja aluno ou professor
 */

const mongoose = require('mongoose')

module.exports = mongoose.model('Person', {
	matricula: {
		type: Number,
		required: true,
		unique: true,
		trim: true
	},
	api_key: {
		type: String
	},
	nome: {
		type: String,
		trim: true
	},
	credentials: {
		salt: {
			type: String,
			required: true
		},
		password_hash: {
			type: String,
			required: true
		}
	}
})
