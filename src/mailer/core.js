/**
 * nodemailer/core.js
 * 
 * @description Core do módulo do mailer. Esse módulo exporta uma função
 * capaz de enviar um email especificando todos os campos manualmente, do
 * sender ao conteúdo. O objetivo é esse arquivo ser usado pelo mailer,
 * não diretamente
 */

'use strict';
const nodemailer = require('nodemailer');

module.exports = async function(
		to = 'bar@example.com',						// list of receivers
		subject = 'Hello ✔',						// Subject line
		text = 'Hello world?',						// plain text body
		html										// html body
	) {
	const from = '"PCMVC Server" <adm.geee@fateccampinas.com.br>'

	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: 'mx1.hostinger.com.br',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: 'adm.geee@fateccampinas.com.br',
			pass: 'fatec@campinas'
		}
	});

	const info = await transporter.sendMail({
		from,
		to,
		subject,
		text,
		html
	})

	console.log(`E-mail sent to ${info.accepted.toString()}`)
	if (info.rejected.length > 0)
		console.log(`Failure sending to: ${info.rejected.toString()}`)
}
