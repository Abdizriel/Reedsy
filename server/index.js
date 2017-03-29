'use strict';

const http = require('http');
const express = require('express');
const dotenv = require('dotenv-safe');

dotenv.load({
	path: `${__dirname}/config/.env`,
	sample: `${__dirname}/config/.env.example`,
	allowEmptyValues: false
});

const QueueConfig = require('./config/queue.conf');
const RoutesConfig = require('./config/routes.conf');
const ApplicationConfig = require('./config/app.conf');
const SocketIOConfig = require('./config/socket.conf');

const app = express();
const server = http.createServer(app);

const socketio = require('socket.io')(server, {
	serveClient: process.env.NODE_ENV !== 'production',
	path: '/socket.io-client'
});

const QueueConfig = require('./config/queue.conf')();
const RoutesConfig = require('./config/routes.conf')();
const ApplicationConfig = require('./config/app.conf')();
const SocketIOConfig = require('./config/socket.conf')();

QueueConfig.init();
ApplicationConfig.init(app);
RoutesConfig.init(app);
SocketIOConfig.init(socketio);

/**
 * @function startServer
 * @description Start API Server
 */
const startServer = () => {
	server.listen(process.env.PORT, process.env.IP, () => {
		console.log('Express server listening on %s:%s in %s mode', process.env.IP, process.env.PORT, process.env.NODE_ENV);
	});
};

setImmediate(startServer);

module.exports = app;
