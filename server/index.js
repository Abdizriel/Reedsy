'use strict';

const http = require('http');
const logger = require('logfmt');
const express = require('express');
const dotenv = require('dotenv-safe');

dotenv.load({
	path: `${__dirname}/config/.env`,
	sample: `${__dirname}/config/.env.example`,
	allowEmptyValues: false
});

const app = express();
const server = http.createServer(app);

const socketio = require('socket.io')(server, {
	serveClient: process.env.NODE_ENV !== 'production',
	path: '/socket.io-client'
});

const Workers = require('./workers')();
const ApplicationConfig = require('./config/app.conf')();
const SocketIOConfig = require('./config/socket.conf')();

ApplicationConfig.init(app);
Workers.init();
SocketIOConfig.init(socketio);

/**
 * @function startServer
 * @description Start API Server
 */
const startServer = () => {
	server.listen(process.env.PORT, process.env.IP, () => {
		logger.log({
			type: 'info',
			msg: 'starting server',
			port: server.address().port,
			address: server.address().address,
			mode: process.env.NODE_ENV
		});
	});
};

setImmediate(startServer);

module.exports = app;
