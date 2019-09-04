/**
 * dashboard/delete_user.js
 * 
 * @description Módulo de remoção de usuários. Esse módulo deleta usuários do
 * banco de dados SE o usuário que fez o request tem a autorização de fazer
 * isso; Admin pode deletar professor e aluno, professores podem remover alunos
 * e alunos, claro, não pode fazer nada
 * 
 */

const Person = require('../db/models/person')
const GetCookieOwner = require('../db/validators/cookie')

module.exports = async function(req, res) {
	const matricula = req.query.matricula
	try {
		if (!matricula) throw 'EmptyUser'

		const matricula_requester = await GetCookieOwner(req.cookies.SessionID)
		if (matricula === matricula_requester) throw 'RemovingYourself'

		const requester = await Person.findOne({ matricula: matricula_requester })
		const user = await Person.findOne({ matricula })

		if (requester.role === 'admin' ||
			requester.role === 'professor' && user.role === 'aluno'
		) {
			Person.deleteOne({ matricula }).exec()
			//res.send({ message: `O usuário '${user.nome}' de matricula ${matricula} foi removido do banco de dados` })
			res.render('success-message', {
				message: `O usuário '${user.nome}' de matricula ${matricula} foi removido do banco de dados`
			})
		} else if (requester.role === 'professor' && user.role != 'aluno') {
			res.status(401).send({ error: 'Professores apenas podem remover alunos no banco, contate um administrador para executar essa operação' })
		} else {
			res.status(401).send({ error: 'Você não tem autorização para executar essa operação' })
		}
	} catch(err) {
		if (err === 'EmptyUser')
			res.status(400).send({ error: 'É necessário especificar a matrícula do usuário a deletar' })
		else if (err === 'RemovingYourself')
			res.status(400).send({ error: 'Você não pode remover a si mesmo' })
		else
			res.status(500).send({ error: 'Internal server error' })
	}
}
