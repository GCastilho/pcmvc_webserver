/**
 * dashboard/index.js
 * 
 * @description handler da dashboard, todos os requests da /dashboard são
 * gerenciados aqui
 */

const Router = require('express').Router()
const cookieParser = require('cookie-parser')
const isValidCookie = require('../db/validators/cookie')

Router.use(cookieParser())

/**@description Router para /dashboard/login */
Router.use('/login', require('./login'))

/**@description Router para /dashboard */
Router.use(function(req, res) {
	isValidCookie(req.cookies.SessionID)
	.then((matricula) => {
		res.render('dashboard')
	}).catch((err) => {
		res.redirect(303, 'login/')
	})
})

module.exports = Router
