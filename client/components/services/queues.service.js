'use strict';

angular.module('reedsyApp')
  .factory('QueueService', $http => {
    /**
     * @function getAll
     * @description Get all Queues
     * @param {Object=} params - Optional parameters
     * @returns {Function|Promise} response
     */
	const getAll = params => $http.get('/api/jobs/0..9999/asc', params);

    /**
     * @function create
     * @description Create new Queue
     * @param {Object} queue - Queue parameters
     * @returns {Function|Promise} response
     */
	const create = queue => $http.post('/api/job', queue);

	return { getAll, create };
});
