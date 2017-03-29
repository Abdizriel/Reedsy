'use strict';

(() => {

  class MainController {

    constructor($http, $scope, socket, QueueService) {
      this.$http = $http;
      this.socket = socket;
      this.queues = [];
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
              created_at: queue.created_at,
              started_at: queue.started_at,
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
