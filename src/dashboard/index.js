/**
 * dashboard/index.js
 * 
 * @description handler da dashboard, todos os requests da /dashboard são
 * gerenciados aqui
 */

const Router = require('express').Router()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const isValidCookie = require('../db/validators/cookie')
const PersonModel = require('../db/models/person')

/**@description Express middlewares */
Router.use(cookieParser())
Router.use(bodyParser.urlencoded({ extended: true }))

/**@description Router para /dashboard/login */
Router.use('/login', require('./login'))

/**
 * @description Middleware de autenticação: handlers após esse só serão
 * executados se o usuário estiver logado (cookie válido)
 */
Router.use(function(req, res, next) {
	isValidCookie(req.cookies.SessionID)
	.then((matricula) => {
		/**@description Atualiza o tempo restante do cookie de sessão */
		const sessionID = req.cookies.SessionID
		res.cookie('SessionID', sessionID, { maxAge:600000, httpOnly:true })
		next()	/**@description Passa para o próximo handler */
	}).catch((err) => {
		res.redirect(303, '/dashboard/login/')
	})
})

/**@description Router para /dashboard/cadastro */
Router.use('/cadastro', require('./cadastro'))

/**@description Router para /dashboard/password */
Router.use('/password', require('./password'))

/**@description Router para /dashboard/delete_user */
Router.use('/delete_user', require('./delete_user'))

/**@description Router para /dashboard */
Router.use('/', function(req, res) {
	let users = []

	PersonModel.find({})
	.lean()
	.then(people => {
		people.forEach(({ matricula, nome, api }) => {
			users.push({
				matricula,
				nome,
				api_enabled: api.enabled
			})
		})
	}).then(() => {
		res.render('dashboard', {
			user: users
		})
	})
})

module.exports = Router
