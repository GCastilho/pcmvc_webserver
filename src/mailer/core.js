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
		from = '"Fred Foo 👻" <foo@example.com>',	// sender address
		to = 'bar@example.com',						// list of receivers
		subject = 'Hello ✔',						// Subject line
		text = 'Hello world?',						// plain text body
		html										// html body
	) {

	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	const testAccount = await nodemailer.createTestAccount();

	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: testAccount.user, // generated ethereal user
			pass: testAccount.pass // generated ethereal password
		}
	});

	const info = await transporter.sendMail({
		from,
		to,
		subject,
		text,
		html
	})

	console.log('Message sent: %s', info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
