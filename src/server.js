const path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

/**@description Define paths for express configs */
const publicDirectoryPath = path.join(__dirname, '../public');

/**@description Setup static directory to serve */
app.use(express.static(publicDirectoryPath));

/**
 * @description Os handlers para todos os requests para a API
 * ficam na pasta ./api
 */
app.use('/api', require('./api'))

/**
 * @description Esse handler será executado se nenhum outro path for encontrado
 * na pasta pública ou nos handlers manuais (como o da API)
 */
app.use((req, res) => {
	/**@todo uma mensagem de 'not found' mais bonita */
	res.status(404).send('<h1>404 - Not found</h1>')
})

app.listen(port, () => {
	console.log('Server is up on port', port)
})
