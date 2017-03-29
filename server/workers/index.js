'use strict';

const { EventEmitter } = require('events');
const logger = require('logfmt');
const kue = require('kue');
const HTMLWorker = require('./html');
const PDFWorker = require('./pdf');

const queue = kue.createQueue({ redis: process.env.REDIS_URI });
const QueueEvents = new EventEmitter();
QueueEvents.setMaxListeners(0);

const Workers = () => {
	/**
	 * @function tokens
	 * @description Available Queue Workers tokens.
	 * @returns {String} token - Name of queue
	 */
	const tokens = () => {
		return {
			HTML: 'html',
			PDF: 'pdf'
		};
	};

	/**
	 * @function concurrency
	 * @description Number of concurrency queues.
	 * @returns {Integer} concurrency - Number of concurrency for queue
	 */
	const concurrency = () => {
		return {
			HTML: 100,
			PDF: 10
		};
	};

	/**
	 * @function workers
	 * @description Available Worker files.
	 * @returns {Object} worker - Specific queue worker object
	 */
	const workers = () => {
		return {
			HTML: HTMLWorker,
			PDF: PDFWorker
		};
	};

	/**
	 * @function build
	 * @description New Queue Worker.
	 * @param {String} token
	 * @returns {Object} worker - Specific queue worker object
	 */
	const build = token => {
		switch (token) {
			case tokens().HTML: return workers().HTML;
			case tokens().PDF: return workers().PDF;
			default: throw new Error('Invalid Queue Workers token:', token);
		}
	};

	/**
	 * @function process
	 * @description Process function for job queue
	 * @param {String} token
	 */
	const process = token => {
		switch (token) {
			case tokens().HTML: {
				queue.process(tokens().HTML, concurrency().HTML, build(tokens().HTML));
				break;
			}
			case tokens().PDF: {
				queue.process(tokens().PDF, concurrency().PDF, build(tokens().PDF));
				break;
			}
			default: throw new Error('Invalid Process token:', token);
		}
	};

	/**
	 * @function init
	 * @description Init Workers module
	 */
	const init = () => {
		const queues = ['html', 'pdf'];

		// eslint-disable-next-line array-callback-return
		queues.map(queue => {
			logger.log({ type: 'info', msg: 'starting worker', worker: queue });
			process(queue);
		});

		queue
			.on('job enqueue', (id, type) => {
				QueueEvents.emit('started');
				logger.log({ type: 'info',  msg: 'queue started', id, queue : type });
			})
			.on('job complete', id => {
				kue.Job.get(id, (err, { type, duration }) => {
    			if (err) return;
					QueueEvents.emit('completed');
					logger.log({
						type: 'info',
						msg: 'queue completed',
						id,
						queue : type,
					 	duration: duration
					});
  			});
			});

		logger.log({ type: 'info', msg: 'configured', service: 'worker' });
	};

	return { init, QueueEvents };
};

module.exports = Workers;
