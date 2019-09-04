/**
 * validation/index.js
 * 
 * @description Handler dos requests para confirmação de email, o link de
 * confirmação é enviado por email
 */

const Router = require('express').Router()
const sha512 = require('js-sha512')
const bodyParser = require('body-parser')
const Person = require('../db/models/person')
const Email_validation = require('../db/models/email_validation')

Router.get('/', function(req, res) {
	const validation_link = req.query.link

	Email_validation.findOne({
		validation_link
	}).then(person => {
		res.render('password', { create_new_account: true})
	}).catch(err => {
		res.send(err)
		console.error(err)
	})
})

/**@description Ativa o body-parser apenas para o request POST */
Router.use(bodyParser.urlencoded({ extended: true }))

Router.post('/', function(req, res) {
	const validation_link = req.query.link
	if (!validation_link)
		return res.status(404).send({error: 'Not found'})
	
	const password = req.body.new_pass
	if (password != req.body.new_pass_confirmation)
		return res.status(400).send({error: 'Passwords mismatch'})

	Email_validation.findOne({
		validation_link
	}).then(({ matricula }) => {
		return Person.findOne({ matricula })
	}).then(person => {
		const password_hash = sha512.create()
			.update(person.credentials.salt)
			.update(password)
			.hex()
		person.credentials.password_hash = password_hash
		person.account_status = 'active'
		return person.save()
	}).then(person => {
		Email_validation.deleteOne({ matricula: person.matricula }).exec()
		return person
	}).then(person => {
		res.render('success-message', {
			message: 'Senha atualizada com sucesso'
		})
	}).catch(err => {
		if (err instanceof TypeError) return res.status(404).send({
			error: 'Invalid validation link'
		})
		res.send(err)
		console.error(err)
	})
})

module.exports = Router
