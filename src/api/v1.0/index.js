/**
 * api/v1.0/index.js
 * 
 * @description handler de todos os requests para a v1.0 da API
 */

const express = require('express')
const bodyParser = require('body-parser')

const ApiV10Handler = express()
ApiV10Handler.use(express.Router())

/**
 * @description tenta decodificar o json do cody do HTTP (se existir), e 
 * se falhar retorna ao cliente uma mensagem de erro informado a causa do Bad Request
 * (o erro, entretanto, pode vir de outro middleware)
 */
ApiV10Handler.use((req, res, next) => {
	bodyParser.json()(req, res, err => {
		if (err) {
			return res.status(400).send('Error decoding input');
		}
		next();
	});
});

/**
 * @description /telemetry é a parte da API relacionada aos dados
 * de telemetria recebida dos módulos de campo (ex: o arduino), a API suporta
 * inserir dados, com um método POST, e colher dados, com um método GET
 */
ApiV10Handler.route('/telemetry')
	.get(require('./gather_telemetry.js'))
	.post(require('./insert_telemetry.js'))

module.exports = ApiV10Handler
