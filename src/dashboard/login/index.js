/**
 * dashboard/login/index.js
 * 
 * @description Handler da página de autenticação para a dashboard
 */

const Router = require('express').Router()
const bodyParser = require('body-parser')

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
	console.log(req.body)
	res.render('login')
})

module.exports = Router
