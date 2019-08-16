/**
 * dashboard/index.js
 * 
 * @description handler da dashboard, todos os requests da /dashboard são
 * gerenciados aqui
 */

const Router = require('express').Router()
const Cookie = require('../db/models/cookie')

/**@description Router para /dashboard/login */
Router.use('/login', require('./login'))

/**@description Router para /dashboard */
Router.use(function(req, res) {
	res.redirect(303, 'login/')
	//res.render('dashboard')
})

module.exports = Router
