'use strict';

const { QueueEvents } = require('./index')();

const events = ['started', 'completed'];

/**
 * @description Emit Model event to client
 * @function createListener
 * @param event - Model event
 * @param socket - Socket library
 */
const createListener = (event, socket) => {
	return doc => {
		socket.emit(event, doc);
	};
};

/**
 * @description Remove event emitter from client
 * @function removeListener
 * @param event - Model event
 * @param listener - Socket Listener
 */
const removeListener = (event, listener) => {
	return () => {
		QueueEvents.removeListener(event, listener);
	};
};

/**
 * @description Broadcast events to client
 * @function register
 * @param socket - Socket library
 */
const register = socket => {
	for (let i = 0, eventsLength = events.length; i < eventsLength; i++) {
		const event = events[i];
		const listener = createListener('service:' + event, socket);

		QueueEvents.on(event, listener);
		socket.on('disconnect', removeListener(event, listener));
	}
};

module.exports = register;
