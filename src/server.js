const path = require('path')
const express = require('express')
const hbs = require('hbs')
const PersonModel = require('./db/models/person')

const app = express()
const port = process.env.PORT || 3000

/**@description Define paths for express configs */
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

/**@description Setup handlebars engine and views location */
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

/**@description Setup static directory to serve */
app.use(express.static(publicDirectoryPath))

/**@description Handler da home page */
app.get('/', (req, res) => {
	let matricula = []
	/**
	 * @todo Substituir uso do modelo de credential pela lista de RAs da
	 * collection de cadastro de usuários (especialmente por segurança)
	 */
	PersonModel.find({})
	.then((result) => {
		result.forEach(entry => {
			matricula.push(entry.matricula)
		})
	}).finally(() => {
		res.render('index', {
			matricula
		})
	})
})

/**
 * @description Envia todos os requests para /dashboard para a
 * subpasta dashboard
 */
app.use('/dashboard', require('./dashboard'))

/**
 * @description Os handlers para todos os requests para a API
 * ficam na pasta ./api
 */
app.use('/api', require('./api'))

/**
 * @description Handler para requests de confirmação de conta (o link enviado
 * por email)
 */
app.use('/validation', require('./validation'))

/**
 * @description Handler da página de documentação
 */
app.use('/docs', (req, res) => {
	res.render('docs')
})

/**
 * @description Esse handler será executado se nenhum outro path for encontrado
 * na pasta pública ou nos handlers manuais (como o da API)
 */
app.use('*', (req, res) => {
	/**@todo uma mensagem de 'not found' mais bonita */
	res.status(404).send('<h1>404 - Not found</h1>')
})

app.listen(port, () => {
	console.log('Webserver is up on port', port)
})
