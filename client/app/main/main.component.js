/* eslint indent:0 */
'use strict';

(() => {
	class MainController {

		constructor($http, $scope, socket, QueueService) {
			this.$http = $http;
			this.socket = socket;
			this.queues = [];
			this.config = {
		    itemsPerPage: 15,
		    maxPages: 5,
		    fillLastPage: false
		  };
			this.QueueService = QueueService;

			$scope.$on('$destroy', () => {
				socket.unsyncUpdates('queue');
			});
		}

		$onInit() {
			this.QueueService.getAll()
        .then(response => {
					this.queues = response.data.map(queue => {
						return {
							createdAt: queue.created_at,
							startedAt: queue.started_at,
							state: queue.state,
							type: queue.type,
							id: queue.id
						};
					});
					this.socket.syncUpdates('queue', this.queues);
				});
		}

		addQueue(type) {
			const priority = type === 'html' ? 'high' : 'low';
			const params = {
				type,
				options: {
					priority,
					attempts: 3
				}
			};

			this.QueueService.create(params)
        .then(response => {
					console.log(response);
				})
        .catch(err => {
					console.error(err);
				});
		}
  }

	angular.module('reedsyApp')
    .component('main', {
			templateUrl: 'app/main/main.html',
			controller: MainController
		});
})();
