/**
 * api/v1.0/models.js
 * 
 * @description esse arquivo contém os modelos do mongoose que a API usa
 * e os métodos de acesso a eles
 * 
 * @see https://mongoosejs.com/docs/models.html
 */

const mongoose = require('../../db/mongoose')

/**
 * @description Objeto com todos os modelos dos protocolos suportados pela
 * API v1.0; Por hora, o único protocolo suportado também é o protocolo 1.0,
 * mas protocolos futuros podem ser adicionados sem problema de compatibilidade
 * com os dispositivos já em funcionamento
 */
let protocolo = {}

/**
 * @param Model name
 * @param Model schema
 * @param Collection name
 */
protocolo.v10 = mongoose.model('Telemetry', {
	matricula: {
		type: Number,
		required: true,
		trim: true
	},
	timestamp: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	latitude: {
		type: Number,
		required: true,
		trim: true
	},
	longitude: {
		type: Number,
		required: true,
		trim: true
	},
	altura: {
		type: Number,
		required: true,
		trim: true
	},
	wind_velocity: {
		type: Number,
		required: true,
		trim: true
	}
}, 'telemetry')

let models = {}
models.protocol = function(version) {
	/**
	 * @description colocar os protocolos é um Map é mais eficiente que um
	 * if/else. A ideia é que você chama essa função passando a versão do
	 * protocolo que você quer o modelo e ele o retorna pra você
	 */
	let protocols = new Map()

	protocols.set(1.0, protocolo.v10)

	/**@description esta chave deve sempre retornar a última versão do protocolo */
	protocols.set('last', protocolo.v10)
	
	if (protocols.has(version)) {
		return protocols.get(version)
	} else {
		throw new RangeError('VersionNotFound')
	}
}

module.exports = models
