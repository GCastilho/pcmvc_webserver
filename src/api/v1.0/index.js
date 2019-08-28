/**
 * api/v1.0/index.js
 * 
 * @description handler de todos os requests para a v1.0 da API
 */

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const ApiV10Handler = express()
ApiV10Handler.use(express.Router())

/**
 * @description /telemetry é a parte da API relacionada aos dados
 * de telemetria recebida dos módulos de campo (ex: o arduino), a API suporta
 * inserir dados, com um método POST, e colher dados, com um método GET
 */
ApiV10Handler.route('/telemetry')
	.get(require('./gather_telemetry'))
	.post(require('./insert_telemetry'))

/**
 * @description Habilita o body-parser para o request ao controller (e os
 * próximos), o body-parser não pode ficar antes do handler da /telemetry
 * pois este recebe o body manualmente
 */
ApiV10Handler.use(bodyParser.json())

/**
 * @description Habilita o handler de cookie, para apenas permitir acesso
 * ao controller de usuários autorizados
 */
ApiV10Handler.use(cookieParser())

/**
 * @description /controller é o handler de controles de administração da API,
 * como habilitar ou desabilitar usuários a acessar a API
 */
ApiV10Handler.post('/controller', require('./controller'))

module.exports = ApiV10Handler
