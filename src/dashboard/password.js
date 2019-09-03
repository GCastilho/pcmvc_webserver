/**
 * dashboard/password.js
 * 
 * @description handler da password, todos os requests da /dashboard/password
 * são gerenciados aqui
 * O objetivo da /dashboard/password é permitir ao usuário que ele atualize
 * sua senha
 */

const Router = require('express').Router()

Router.get('/', function(req, res) {
	res.render('password')
})

Router.post('/', function(req, res) {
	res.send(req.body)
})

module.exports = Router
