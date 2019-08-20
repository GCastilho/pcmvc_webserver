/**
 * db/validators/cookie.js
 * 
 * @description Recebe um cookie como argumento e retorna uma promessa, se
 * o cookie é válido (valor, matricula e timestamp) a promessa é resolvida,
 * do contrário a promesa é rejeitada
 */

const CookieModel = require('../models/cookie')

module.exports = function(sessionID) {
	return new Promise((resolve, reject) => {
		CookieModel.findOne({
			sessionID
		}).then((cookie) => {
			if (cookie === null) throw 'Cookie not found'
			/**@description O cookie deve ter até 10 minutos para ser válido */
			if (new Date() > new Date(cookie.date.getTime() + 10*60000))
				throw 'Invalid cookie'
			return Promise.resolve(cookie.matricula)
		}).then((matricula) => {
			return CookieModel.findOneAndUpdate({
				matricula
			}, {
				date: new Date()
			}, {
				new: true,
				useFindAndModify: false
			})
		}).then(({ matricula }) => {
			resolve(matricula)
		}).catch((err) => {
			reject(err)
		})
	})
}
