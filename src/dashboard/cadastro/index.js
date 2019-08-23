/**
 * dashboard/cadastro/index.js
 * 
 * @description Handler para a sub-página de cadastro de usuários da dashboard
 */

const sha512 = require('js-sha512')
const bodyParser = require('body-parser')
const Router = require('express').Router()
const randomstring = require('randomstring')
const PersonModel = require('../../db/models/person')

/**
 * @description Ativa o middleware para dar parse no body enviado pelo form
 * da página de cadastro
 */
Router.use(bodyParser.urlencoded({ extended: true }))

Router.get('/', function(req, res) {
	res.render('cadastro')
})

Router.post('/', function(req, res) {
	const salt = randomstring.generate()
	const temporaryPassword = randomstring.generate({ length: 10 })

	let password_hash = sha512.create()
	password_hash.update(salt)
	password_hash.update(temporaryPassword)

	const user = {
		matricula: req.body.matricula,
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
	new PersonModel(user).save()
	.then(person => {
		console.log(person)
		res.send(person)
	}).catch(err => {
		console.log(err)
		res.send(err)
	})
})

module.exports = Router
