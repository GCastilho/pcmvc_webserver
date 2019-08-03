/**
 * api/index.js
 * 
 * @description handler da API, todos os requests da /api são
 * gerenciados aqui
 */

const ApiRouter = require('express').Router()

//Coloque os handlers aqui
ApiRouter.use('/v1.0', require('./v1.0'))

module.exports = ApiRouter
