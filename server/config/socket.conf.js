'use strict';

const logger = require('logfmt');
const QueueSockets = require('../workers/index.socket');

const SocketIOConfig = () => {
	const onDisconnect = socket => {
		socket.on('disconnect', () => {
			socket.log('DISCONNECTED');
		});
	};

	const onConnect = socket => {
		socket.on('info', data => {
			socket.log(JSON.stringify(data, null, 2));
		});
		// eslint-disable-next-line new-cap
		QueueSockets(socket);
	};

	const init = socketio => {
		socketio.on('connection', socket => {
			socket.address = socket.request.connection.remoteAddress +
			':' + socket.request.connection.remotePort;

			socket.connectedAt = new Date();

			socket.log = (...data) => {
				console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
			};

			onConnect(socket);
			onDisconnect(socket);
			socket.log('CONNECTED');
		});

		logger.log({ type: 'info', msg: 'configured', service: 'socket' });
	};

	return { init };
};

module.exports = SocketIOConfig;
