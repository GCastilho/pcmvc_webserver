/**
 * api/v1.0/controller.js
 * 
 * @description O controller serve para configurações e tweaks da API,
 * basicamente um 'painel de controle' dela. Atualmente tem a capacidade de
 * habilitar ou desabilitar que um usuário consiga inserir dados
 */

const cookieValidator = require('../../db/validators/cookie')
const Person = require('../../db/models/person')

module.exports = function(req, res) {
	cookieValidator(req.cookies.SessionID)
	.then(matricula => {
		Person.findOne({
			matricula
		}).then(requester => {
			if (requester.role != 'admin')
				return res.status(401).send({
					success: false,
					message: 'Unauthorized'
				})

			if (req.body.scope === 'change access') {
				Person.updateOne({
					matricula: req.body.matricula
				}, {
					"$set": {
						"api.enabled": req.body.command === 'enable'
					}
				})
				.then(res.send({ success: true }))
				.catch(err => {
					res.status(400).send({
						success: false,
						message: 'Error updating data'
					})
				})
			} else {
				res.status(400).send({
					success: false,
					message: 'Unrecognized scope'
				})
			}
		})
	}).catch(err => res.status(500).send(err))
}
