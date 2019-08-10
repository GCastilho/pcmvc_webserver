/**
 * api/v1.0/gather_telemetry.js
 * 
 * @description esse é o entrypoint da API para colher os dados de telemetria.
 * Um GET request irá retornar uma stream de JSON objects, um para cada linha,
 * filtrados de acordo com os parâmetros passados na query, o browser deverá
 * processar essa stream e retorná-la ao usuário num formato adequado (ex: CSV)
 */

const CsvBuilder = require('csv-builder')
const Telemetry = require('./models').protocol('last')
const builder = new CsvBuilder({ headers: [
	'matricula',
	'timestamp',
	'data',
	'hora',
	'latitude',
	'longitude',
	'altura',
	'wind_velocity'
]})

module.exports = function(req, res) {
	const query = req.query
	const filter = {}

	if (query.matricula != 'all' && query.matricula != undefined) {
		filter.matricula = query.matricula
	}

	if (query.date_filter_type === 'range') {
		const dinicial = new Date(query.dinicial + ' GMT-0300')
		const dfinal = new Date(query.dfinal + ' GMT-0300')
		filter.timestamp = { $gt:dinicial, $lt:dfinal }
	} else if(query.date_filter_type === 'last_x') {
		const date = new Date()
		if (query.x_unity === 'dias') {
			date.setDate(date.getDate() - query.last_x)
		} else if (query.x_unity === 'meses') {
			date.setMonth(date.getMonth() - query.last_x)
		}
		filter.timestamp = { $gt:date }
	}

	res.attachment(`db_export_${new Date().toLocaleDateString()}.csv`)
	Telemetry.find(filter, {
		_id: 0,
		__v: 0
	})
	.sort({timestamp:'ascending'})
	.lean()
	.cursor()
	.on('data', (row) => {
		const DATE = new Date(row.timestamp)
		const data = DATE.toLocaleDateString('pt-BR')
		const hora = DATE.toLocaleTimeString('pt-BR')
		row.data = data
		row.hora = hora
	})
	.pipe(builder.createTransformStream())
	.pipe(res)
	.on('end', () => {
		res.end()
	})
}
