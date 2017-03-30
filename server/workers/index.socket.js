'use strict';

const { QueueEvents } = require('./index')();

const events = ['save', 'remove'];

/**
 * @description Emit Model event to client
 * @function createListener
 * @param event - Model event
 * @param socket - Socket library
 */
const createListener = (event, socket) => doc => {
	socket.emit(event, doc);
};

/**
 * @description Remove event emitter from client
 * @function removeListener
 * @param event - Model event
 * @param listener - Socket Listener
 */
const removeListener = (event, listener) => () => {
	QueueEvents.removeListener(event, listener);
};

/**
 * @description Broadcast events to client
 * @function register
 * @param socket - Socket library
 */
const register = socket => {
	events.forEach(event => {
		const listener = createListener('queue:' + event, socket);

		QueueEvents.on(event, listener);
		socket.on('disconnect', removeListener(event, listener));
	});
};

module.exports = register;
