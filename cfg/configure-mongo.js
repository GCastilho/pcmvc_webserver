/**
 * cfg/configure-mongo.js
 * 
 * @description esse arquivo contém a estrutura do mongoDB, com usuários e collections
 * 
 * Para executá-lo digite '<mongo> path/to/this/file.js', sendo <mongo> o
 * binário do shell do servidor (não é 'mongod' ou 'mongos', o utilitário chama-se 'mongo')
 * 
 * ou cole o conteúdo desse arquivo no shell de sessão do db com privilégios de administrador
 */

db = db.getSiblingDB('pcmvc')

db.createUser({
	user: "telemetry_server",
	pwd: "kPI6dBZLbRVbPT2P0Q7M",
	roles: [ { role: "readWrite", db: "pcmvc" } ]
})
