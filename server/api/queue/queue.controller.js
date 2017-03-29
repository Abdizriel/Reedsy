/**
 * POST    /api/queue              ->  create
 */

/**
 * @description API Response Utility functions
 * @param {Function} handleError - Handle errors
 * @param {Function} respondWithResult - Responds with results
 */
const { respondWithResult, handleError } = require('../../lib/response');

/**
 * @function create
 * @description Function that create queue
 * @param {Object} req - Express Framework Request Object
 * @param {Object} res - Express Framework Response Object
 */
const create = (req, res) => {
	// TODO
	Promise.resolve()
		.then(respondWithResult(res))
		.catch(handleError(res));
};

module.exports = { create };
