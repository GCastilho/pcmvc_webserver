/**
 * api/v1.0/insert_telemetry.js
 * 
 * @description o entrypoint da API, esse arquivo é executado quando o request
 * de inserir dados de velocidade do vento é recebido. Uma coisa a se notar
 * é que a versão 1.0 da API suporta múltiplas versões de PROTOCOLO (são coisas
 * diferentes). Múltiplas versões de protocolo são suportadas por
 * compatibilidade, já que uma atualização do protocolo (ou remoção da API)
 * faz com que os devices rodando as versões antigas parem de funcionar,
 * já que eles devem ser atualizados manualmente. Mantenha isso em mente
 * ao atualizar a API ou o protocolo de telemetria 
 */

const sha256 = require('js-sha256')
const Models = require('./models')

const minVersion = 1.0

/**
 * @description A API checa a validade da assinatura (que é o sha256 da
 * concatenação da mensagem com a api_key) e então tenta salvar (os campos da)
 * mensagem (que seguem o modelo) no database, se bem sucedido retorna uma
 * mensagem de sucesso ao cliente
 * 
 * @see ./models.js
 */
module.exports = function(req, res) {
	req.body = ''

	req.on('data', chunk => {
		/**
		 * @todo adicionar um tamanho máximo pra req.body,
		 * retornando erro ao ultrapassar
		 */
		req.body += chunk
	})

	req.on('end', () => {
		const signature = req.headers.signature
		let message
		try {
			message = JSON.parse(req.body)
		} catch(e) {
			return res.status(400).send({ message: 'Error decoding input' })
		}
	
		if (minVersion > message.ver) {
			return res.status(400)
				.send({ error: `Minimum protocol version is ${minVersion} or higher` })
		}
	
		isValidInputSignature(req.body, signature)
		.then(function saveTelemetry() {
			const Telemetry = Models.protocol(message.ver)
			const DATE = new Date()

			const data = {
				matricula: message.matricula,
				timestamp: DATE.getMilliseconds(),
				date: DATE,
				latitude: message.lat,
				longitude: message.lon,
				altura: message.hgt,
				wind_velocity: message.wind
			}

			return new Telemetry(data).save()
		}).then(function sendSuccessMessage(telemetry) {
			res.status(201).send({ message: 'Successfully inserted telemetry in database' })
		}).catch((error) => {
			if (error.name === 'ValidationError'){
				res.status(400).send({
					error: `Message uses protocol version ${message.ver} but does not follow it's standards`,
					message: error.message
				})
			} else if (error.code === 401) {
				res.status(401).send({ error: 'Fail to verify message signature, check your API Key' })
			} else if (error.message === 'VersionNotFound') {
				res.status(422).send({ error: `Unreconized protocol version: ${message.ver}` })
			} else {
				res.status(500).send({
					error: 'Internal server error',
					message: error.message
				})
			}
		})
	})
}

const isValidInputSignature = function(body, signature) {
	const matricula = JSON.parse(body).matricula
	const ApiCredential = Models.credential

	return new Promise((resolve, reject) => {
		ApiCredential.findOne({
			matricula
		}).then((credential) => {
			/**
			 * @description O mesmo error code é usado para matrícula não
			 * encontrada e chave inválida (para matrícula existente), o motivo
			 * disso é impossibilitar a identificação de quais
			 * matriculas estão cadastradas do database e quais não estão
			 */
			const error = { code: 401 }
			if (!credential) {
				/**
				 * @decription se credential for undefined significa que
				 * a matricula não foi encontrada no DB
				 */
				reject(error)
			}

			let hash = sha256.create()
			hash.update(body)
			hash.update(credential.api_key)
			const calculatedSignature = hash.hex()

			signature === calculatedSignature ? resolve() : reject(error)
		}).catch((err) => {
			reject({ code: 500 })
		})
	})
}
