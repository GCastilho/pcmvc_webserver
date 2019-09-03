/**
 * nodemailer/index.js
 */

const Core = require('./core')
const mailer = {}

/**
 * @todo Melhorar essa mensagem
 */
mailer.sendTo = {
	newProfessor: function(destination, name, api_key, validation_link) {
		const subject = 'Bem vindo ao Projeto Comunitário de Medição do Vento de Campinas'
		const body = `Caro ${name}, bem vindo ao PCMVC - Projeto Comunitário de Medição do Vento de Campinas
		
		Você está recebendo esse e-mail pois ele foi cadastrado como um professor no nosso sistema

		Esta é a sua chave da API de telemetria: ${api_key}

		Use ela no arduino para poder se autenticar em nossa API e enviar dados de velocidade do vento e contribuir para o projeto
		
		Para concluir o cadastro e poder ter acesso ao painel de administração use o seguinte link: http://localhost:3000/validation?link=${validation_link}`

		Core(undefined, destination, subject, body)
	},
	newAluno: function(destination, name, api_key) {
		const subject = 'Bem vindo ao Projeto Comunitário de Medição do Vento de Campinas'
		const body = `Caro ${name}, bem vindo ao PCMVC - Projeto Comunitário de Medição do Vento de Campinas

		Você está recebendo esse e-mail pois ele foi cadastrado como um aluno no nosso sistema

		Esta é a sua chave da API de telemetria: ${api_key}

		Use ela no arduino para poder se autenticar em nossa API e enviar dados de velocidade do vento e contribuir para o projeto`

		Core(undefined, destination, subject, body)
	}
}

module.exports = mailer
