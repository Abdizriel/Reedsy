'use strict';

/**
 * @function respondWithResult
 * @description Function that returns response with data
 * @param {Object} res - Express Framework Response Object
 * @param {Number=} statusCode - Response status code
 */
const respondWithResult = (res, statusCode) => {
	statusCode = statusCode || 200;
	return entity => {
		if (entity) {
			return res.status(statusCode).json(entity);
		}
	};
};

/**
 * @function handleError
 * @description Function that returns response with error details
 * @param {Object} res - Express Framework Response Object
 * @param {Number=} statusCode - Response status code
 */
const handleError = (res, statusCode) => {
	statusCode = statusCode || 500;
	return err => res.status(statusCode).send(err);
};

module.exports = { respondWithResult, handleError };
