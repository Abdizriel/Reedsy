'use strict';

/**
 * @function HTMLWorker
 * @classdesc HTML queue worker
 * @module HTMLWorker
 */
const HTMLWorker = (job, done) => {
	setTimeout(() => {
		done();
	}, 10000);
};

module.exports = HTMLWorker;
