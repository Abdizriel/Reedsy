'use strict';

/**
 * @function PDFWorker
 * @description PDF queue worker
 * @module PDFWorker
 */
const PDFWorker = (job, done) => {
	setTimeout(() => {
		done();
	}, 100000);
};

module.exports = PDFWorker;
