/**
 * api/v1.0/gather_telemetry.js
 * 
 * @description esse é o entrypoint da API para colher os dados de telemetria.
 * Um GET request irá retornar um arquivo csv com os dados de telemetria
 * filtrados de acordo com os parâmetros passados na query
 */

const Telemetry = require('./models').protocol('last')

module.exports = function(req, res) {
	const query = req.query
	let filter = {}
	let order = 1 /**@description 1 -> ascendente, -1 -> descendente */

	if (query.matricula != 'all' && query.matricula != undefined) {
		filter.matricula = query.matricula
	}

	if (query.date_filter_type === 'range') {
		let dinicial = new Date(query.dinicial + ' GMT-0300')
		let dfinal = new Date(query.dfinal + ' GMT-0300')
		filter.timestamp = { $gt:dinicial, $lt:dfinal }
	} else if(query.date_filter_type === 'last_x') {
		let date = new Date()
		if (query.x_unity === 'dias') {
			date.setDate(date.getDate() - query.last_x)
		} else if (query.x_unity === 'meses') {
			date.setMonth(date.getMonth() - query.last_x)
		}
		filter.timestamp = { $gt:date }
	}

	res.attachment(`db_export_${new Date().toLocaleDateString()}.csv`)
	const csv_headers = [ 'matricula', 'timestamp', 'data', 'hora', 'lat', 'lon', 'hgt', 'wind' ]
	res.write(csv_headers.join() + '\n')

	Telemetry.find(filter).sort({timestamp:order})
	.then((result) => {
		result.forEach(row => {
			let csv_row = []
			csv_row.push(row.matricula)
			csv_row.push(row.timestamp)
			{
				const date = new Date(row.timestamp)
				csv_row.push(date.toLocaleDateString('pt-BR'))
				csv_row.push(date.toLocaleTimeString('pt-BR'))
			}
			csv_row.push(row.lat)
			csv_row.push(row.lon)
			csv_row.push(row.hgt)
			csv_row.push(row.wind)
			res.write(csv_row.join() + '\n')
		})
	}).then(() => {
		res.end()
	})
}
