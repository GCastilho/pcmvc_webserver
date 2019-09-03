/**
 * dashboard/cadastro.js
 * 
 * @description Handler para a sub-página de cadastro de usuários da dashboard
 */

const sha512 = require('js-sha512')
const Router = require('express').Router()
const randomstring = require('randomstring')
const Person = require('../db/models/person')
const Email_validation = require('../db/models/email_validation')
const Mailer = require('../mailer')

Router.get('/', function(req, res) {
	res.render('cadastro')
})

Router.post('/', async function(req, res) {
	const salt = randomstring.generate()

	/**
	 * @description Gera um salt (permanente) e um password aleatório que nunca
	 * será utilizado (não sendo necessário saber), pois a conta estará
	 * desativada até o usuário confirmar o email, e ao confirmar o email ele
	 * irá inserir a senha definitiva
	 */
	let password_hash = sha512.create()
	password_hash.update(salt)
	password_hash.update(randomstring.generate({ length: 10 }))

	const user = {
		matricula: req.body.matricula,
		email: req.body.email,
		nome: req.body.nome,
		role: req.body.role === 'aluno' ? 'aluno' :
				req.body.admin === 'on' ? 'admin' : 'professor',
		api: {
			key: randomstring.generate({
				length: 32,
				readable: true,
				charset: 'alphanumeric'
			}),
			enabled: true
		},
		credentials: req.body.role != 'aluno' ? {
			salt,
			password_hash: password_hash.hex()
		} : undefined
	}

	const email_validation = {
		matricula: req.body.matricula,
		validation_link: randomstring.generate(),
		request_date: new Date()
	}

	try {
		const person = await new Person(user).save()
		const validation = await new Email_validation(email_validation).save()
	
		if (person.role === 'professor' || person.role === 'admin') {
			Mailer.sendTo.newProfessor(
				person.email,
				person.nome,
				person.api.key,
				validation.validation_link
		)} else {
			Mailer.sendTo.newAluno(
				person.email,
				person.nome,
				person.api.key
		)}
		res.render('sucesso-cadastro', {
			matricula: person.matricula,
			nome: person.nome,
			api_key: person.api.key
		})
	} catch(err) {
		console.log(err)
		res.send(err)
	}
})

module.exports = Router
