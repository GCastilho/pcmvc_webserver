/**
 * dashboard/newPassword.js
 * 
 * @description Handler para requests de redefinição de senha
 */

const Router = require('express').Router()
const randomstring = require('randomstring')
const Person = require('../db/models/person')
const Mailer = require('../mailer')
const Email_validation = require('../db/models/email_validation')

Router.post('/', async function(req, res) {
	const email = req.body.email //Email q foi pedido redefinição de senha
	if (!email) return res.status(401).send({ error: 'É necessário um endereço de email' })

	try {
		const person = await Person.findOne({ email })
		const validation = await new Email_validation({
			matricula: person.matricula,
			validation_link: randomstring.generate(),
			request_date: new Date()
		}).save()
		Mailer.sendTo.novaSenha(person.email, person.name, validation.validation_link)
		res.send({
			message: `Foi enviado um email para ${person.email} com o link de redefinição de senha`
		})
	} catch(err) {
		res.status(500).send({ error: 'Internal server error' })
		console.log(err)
	}
})

module.exports = Router
