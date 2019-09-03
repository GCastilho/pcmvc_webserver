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
	},

	novaSenha: function(destination, name, validation_link) {
		const subject = 'Solicitação de redefinição de senha | Projeto Comunitário de Medição do Vento de Campinas'

		const body = `Caro ${name}, foi solicitada redefinição de senha para a sua conta
		
		Para redefinir sua senha use o seguinte link: http://localhost:3000/validation?link=${validation_link}
		
		Se não foi você que pediu a redefinição de senha, fique tranquilo, pois nada será alterado`

		Core(undefined, destination, subject, body)
	}
}

module.exports = mailer
