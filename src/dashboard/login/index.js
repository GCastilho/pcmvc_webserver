/**
 * dashboard/login/index.js
 * 
 * @description Handler da página de autenticação para a dashboard
 */

const Router = require('express').Router()
const bodyParser = require('body-parser')
const sha512 = require('js-sha512')
const randomstring = require("randomstring")

const PersonModel = require('../../db/models/person')
const CookieModel = require('../../db/models/cookie')

/**
 * @description Ativa o middleware para dar parse no body enviado pelo form
 * da página de login
 */
Router.use(bodyParser.urlencoded({ extended: true }))

/**@description Acessar por GET retorna a página de login */
Router.get('/', function(req, res) {
	res.render('login')
})

/**
 * @description Acessar por POST autentica o usuário e em caso de sucesso
 * redireciona-o para a /dashboard
 */
Router.post('/', function(req, res) {
	PersonModel.findOne({
		matricula: req.body.matricula
	}).then((person) => {
		if (person === null) throw 'UserNotFound'

		/**
		 * @description o 'password_hash' armazenado no database é o sha512 da
		 * concatenação do salt com o password do usuário, então para verificar
		 * a validade do password fornecido temos que recriar o hash seguindo
		 * o mesmo processo
		 */
		let password_hash = sha512.create()
		password_hash.update(person.credentials.salt)
		password_hash.update(req.body.password)

		if (person.credentials.password_hash != password_hash.hex())
			throw 'InvalidCredentials'

		/**
		 * @description A partir daqui o código só é executado se
		 * o usuário está autenticado
		 */

		const sessionID = randomstring.generate(128)

		/**@see https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate */
		CookieModel.findOneAndUpdate({
			matricula: req.body.matricula
		}, {
			sessionID,
			date: new Date()
		}, {
			new: true,
			upsert: true,
			useFindAndModify: false
		}).then((cookie) => {
			/**
			 * @description Se a autenticação, a criação e o salvamento do
			 * cookie foram bem sucedidas, redireciona o usuário para a
			 * /dashboard/ com o cookie de autenticação
			 */
			res.cookie('SessionID', sessionID, { httpOnly:true })
			res.redirect(303, '/dashboard/')
		})
	}).catch((err) => {
		if (err === 'UserNotFound' || err === 'InvalidCredentials') {
			/**
			 * @description Diferenciar usuário não encontrado de credenciais
			 * inválidas faz com que seja possível descobrir quais RAs estão
			 * cadastradas no database, por isso a mensagem é a mesma
			 */
			res.status(401).send({error: 'Not authorized'})
		} else {
			/**
			 * @description Esse else pode ser chamado em situações onde não foi
			 * um erro interno do servidor, como uma entrada malformada,
			 * por exemplo: campo matrícula com uma letra
			 * 
			 * @todo Fazer um error handling melhor
			 */
			res.status(500).send({error: 'Internal server error'})
		}
	})
})

module.exports = Router
