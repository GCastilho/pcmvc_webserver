/**
 * db/mongoose.js
 * 
 * @description centraliza as configurações de conexão do mongoose
 * em um único arquivo
 */

const mongoose = require('mongoose')

/**
 * @description Database name: pcmvc
 */
mongoose.connect('mongodb://127.0.0.1:27017/pcmvc', {
	useNewUrlParser: true,
	useCreateIndex: true
})

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Connected to the database!')
});

/**
 * @description ao exportar o mongoose, mantém-se as configurações
 * todas nesse arquivo e o acesso aos métodos do mongoose
 */
module.exports = mongoose
