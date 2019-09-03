/**
 * db/models/email_validation.js
 * 
 * @description Model da collection de email_validation, que contém os links de
 * validação para definição de senha enviados por email e os usuários a qual
 * eles pertencem
 */

const mongoose = require('mongoose')

/**
 * @todo Fazer o validation_link expirar depois de um tempo caso seja
 * um link para atualizar a senha
 */
module.exports = mongoose.model('email_validation', {
	matricula: {
		type: Number,
		required: true,
		unique: true
	},
	validation_link: {
		type: String,
		required: true,
		unique: true
	},
	request_date: {
		type: Date,
		required: true
	}
})
