const express = require('express')

const app = express()
const port = process.env.PORT || 3000

/**
 * @description Os handlers para todos os requests para a API
 * ficam na pasta ./api
 */
app.use('/api', require('./api'))

app.use('/', (req, res) => {
	res.send('Hello World')
})

app.listen(port, () => {
	console.log('Server is up on port', port)
})
