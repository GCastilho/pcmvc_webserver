/**
 * cfg/configure-mongo.js
 * 
 * @description esse arquivo contém a estrutura do mongoDB, com usuários e collections
 * 
 * Para executá-lo digite '<mongo> path/to/this/file.js', sendo <mongo> o
 * binário do shell do servidor (não é 'mongod' ou 'mongos', o utilitário chama-se 'mongo')
 * 
 * ou cole o conteúdo desse arquivo no shell de sessão do db com privilégios de administrador
 * 
 * @see https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/
 */

db = db.getSiblingDB('pcmvc')

db.createUser({
	user: "telemetry_server",
	pwd: "kPI6dBZLbRVbPT2P0Q7M",
	roles: [ { role: "readWrite", db: "pcmvc" } ],
	authenticationRestrictions: [{ clientSource: ["127.0.0.1"] }]
})

/**@see https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection */
db.createCollection('telemetry', {
	validator : { $jsonSchema : {
		bsonType: "object",
		required: [ "matricula", "timestamp", "latitude", "longitude", "altura", "wind_velocity" ],
		properties: {
			matricula: {
				bsonType: "long",
				description: "deve ser um número e é obrigatório"
			},
			timestamp: {
				bsonType: "date"
			},
			latitude: {
				bsonType: "double",
				description: "deve ser um número e é obrigatório"
			},
			longitude: {
				bsonType: "double",
				description: "deve ser um número e é obrigatório"
			},
			altura: {
				bsonType: "double",
				description: "deve ser um número e é obrigatório"
			},
			wind_velocity: {
				bsonType: "double",
				description: "deve ser um número e é obrigatório"
			}
		}
	}},
	validationLevel: "strict"
})

/**
 * @description Usa 'timestamp' como index do mongo, para agilizar querys
 * e reduzir o consumo de memória
 */
db.telemetry.createIndex({ timestamp:1 })
