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
	/**@todo Validar o e-mail corretamente */
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: true
	},
	account_status: {
		type: String,
		required: true,
		default: 'email not verified'
	},
	nome: {
		type: String,
		trim: true
	},
	role: {
		type: String,
		default: 'aluno'
	},
	api: {
		key: {
			type: String,
			required: true
		},
		enabled: {
			type: Boolean,
			required: true
		}
	},
	credentials: {
		salt: {
			type: String,
			required: false
		},
		password_hash: {
			type: String,
			required: false
		}
	}
})
