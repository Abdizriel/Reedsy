'use strict';

const logger = require('logfmt');
const QueueSockets = require('../workers/index.socket');

/**
 * @function SocketIOConfig
 * @description SocketIO configuration
 * @constructor
 * @returns {Object}
 */
const SocketIOConfig = () => {
	/**
	 * @function onDisconnect
	 * @description On disconnect from socket perform this
	 * @param {Object} socket - socket data
	 * @returns {Object}
	 */
	const onDisconnect = socket => {
		socket.on('disconnect', () => {
			socket.log('DISCONNECTED');
		});
	};

	/**
	 * @function onConnect
	 * @description On Connect from socket perform this
	 * @param {Object} socket - socket data
	 * @returns {Object}
	 */
	const onConnect = socket => {
		socket.on('info', data => {
			socket.log(JSON.stringify(data, null, 2));
		});
		// eslint-disable-next-line new-cap
		QueueSockets(socket);
	};

	/**
	 * @function init
	 * @description Init socket IO config
	 * @param {Object} socketio - SocketIO
	 */
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
