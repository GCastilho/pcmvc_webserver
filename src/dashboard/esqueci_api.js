/**
 * dashboard/esqueci_api.js
 * 
 * @description Esse arquivo envia um email com a chave de API para o email
 * informado, serve para um aluno/professor/administrador poder facilmente
 * ser lembrado de sua chave de API de uma maneira segura
 */

const Router = require('express').Router()
const Person = require('../db/models/person')
const Mailer = require('../mailer')

Router.post('/', async function(req, res) {
	const email = req.body.email //Email q foi pedido lembrete de API
	if (!email) return res.status(401).send({ error: 'É necessário um endereço de email' })

	try {
		const person = await Person.findOne({ email })
		Mailer.sendTo.lembreteApi(person.email, person.name, person.api.key)
		res.send({
			message: `Foi enviado um email para ${person.email} com a chave de API correspondente`
		})
	} catch(err) {
		res.status(500).send({ error: 'Internal server error' })
		console.log(err)
	}
})

module.exports = Router
