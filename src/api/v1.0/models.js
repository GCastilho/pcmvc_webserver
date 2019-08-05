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
var protocolo = new Object()

/**
 * @param Model name
 * @param Model schema
 * @param Collection name
 */
protocolo.v10 = mongoose.model('Telemetry', {
	RA: {
		type: Number,
		required: true,
		trim: true
	},
	timestamp: {
		type: Number,
		required: true
	},
	lat: {
		type: Number,
		required: true,
		trim: true
	},
	lon: {
		type: Number,
		required: true,
		trim: true
	},
	hgt: {
		type: Number,
		required: true,
		trim: true
	},
	wind: {
		type: Number,
		required: true,
		trim: true
	}
}, 'telemetry')

/**
 * @description Modelo das credenciais da API. Note que o nome da tabela com as
 * credenciais que a API irá procurar é a 'api_credential', esse nome pode ser
 * alterado em outros lugares se também for alterado aqui, ou a API não
 * conseguirá encontrar as credenciais de acesso à API e deixará de funcionar
 */
const ApiCredential = mongoose.model('ApiCredential', {
	matricula: {
		type: Number,
		required: true,
		trim: true
	},
	api_key: {
		type: String,
		required: true,
		trim: true
	}
}, 'api_credential')


var models = new Object()
models.protocol = function(version) {
	/**
	 * @description colocar os protocolos é um Map é mais eficiente que um
	 * if/else. A ideia é que você chama essa função passando a versão do
	 * protocolo que você quer o modelo e ele o retorna pra você
	 */
	let protocols = new Map()

	protocols.set(1.0, protocolo.v10)
	
	if (protocols.has(version)) {
		return protocols.get(version)
	} else {
		throw new RangeError('VersionNotFound')
	}
}

models.credential = function() {
	return ApiCredential
}

module.exports = models
