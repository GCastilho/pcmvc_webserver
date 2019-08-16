const mongoose = require('mongoose')

module.exports = mongoose.model('Cookie', {
	username: {
		type: String,
		required: true
	},
	sessionID: {
		type: String,
		required: true
	},
	timestamp: {
		type: Date,
		required: true
	}
})
