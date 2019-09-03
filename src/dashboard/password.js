/**
 * dashboard/password.js
 * 
 * @description handler da password, todos os requests da /dashboard/password
 * são gerenciados aqui
 * O objetivo da /dashboard/password é permitir ao usuário que ele atualize
 * sua senha
 */

const Router = require('express').Router()
const sha512 = require('js-sha512')
const Person = require('../db/models/person')
const GetCookieOwner = require('../db/validators/cookie')

Router.get('/', function(req, res) {
	res.render('password')
})

Router.post('/', function(req, res) {
	const password = req.body.new_pass
	if (password != req.body.new_pass_confirmation)
		return res.status(400).send({error: 'Passwords mismatch'})

	GetCookieOwner(req.cookies.SessionID)
	.then(matricula => {
		return Person.findOne({ matricula })
	}).then(person => {
		/**@description Checa se o password antigo é válido */
		const old_password_hash = sha512.create()
			.update(person.credentials.salt)
			.update(req.body.old_pass)
			.hex()
		if (person.credentials.password_hash != old_password_hash)
			throw 'InvalidOldPassword'

		/**@description Atualiza a senha do usuário */
		const password_hash = sha512.create()
			.update(person.credentials.salt)
			.update(password)
			.hex()
		person.credentials.password_hash = password_hash
		return person.save()
	}).then(person => {
		res.render('sucesso-nova-senha')
	}).catch(err => {
		if (err === 'InvalidOldPassword') {
			res.status(401).send({
				error: 'A senha original informada não é válida'
			})
		} else {
			console.error(err)
			res.status(500).send({error: 'Internal server Error'})
		}
	})
})

module.exports = Router
