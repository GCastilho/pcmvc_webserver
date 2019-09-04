/**
 * dashboard/cadastro.js
 * 
 * @description Handler para a sub-página de cadastro de usuários da dashboard
 * 
 * @todo Alunos não recebem emails de confirmação, mas os links de confirmação
 * para contas de alunos estão sendo salvos do database. Resolver isso
 */

const sha512 = require('js-sha512')
const Router = require('express').Router()
const randomstring = require('randomstring')
const Person = require('../db/models/person')
const Email_validation = require('../db/models/email_validation')
const Mailer = require('../mailer')
const GetCookieOwner = require('../db/validators/cookie')

Router.get('/', function(req, res) {
	res.render('cadastro')
})

Router.post('/', async function(req, res) {
	try {
		const requester_matricula = await GetCookieOwner(req.cookies.SessionID)
		const requester = await Person.findOne({ matricula: requester_matricula })
		if (requester.role === 'aluno')
			return res.status(401).send({ error: 'Alunos não podem adicionar usuários ao sistema' })
		else if (requester.role === 'professor' && req.body.role != 'aluno')
			return res.status(401).send({ error: 'Um professor só pode adicionar alunos ao sistema' })
		else if (!(requester.role != 'admin' || requester.role != 'professor'))
			return res.status(500).send({ error: 'Erro de configuração do sistema' })
	} catch(err) {
		if (err === 'Cookie not found' || err === 'Invalid cookie')
			return res.status(400).send({ error: 'Unauthenticated'} )
		else
			return res.status(500).send({ error: 'Internal server error' })
	}

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
		if (err.code === 11000) {
			res.status(409).send({ error: 'Usuário já está cadastrado' })
		} else {
			console.log(err)
			res.send(err)
		}
	}
})

module.exports = Router
