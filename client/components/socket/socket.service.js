/* global io */
'use strict';

angular.module('reedsyApp')
  .factory('socket', (toastr, socketFactory) => {
    const ioSocket = io('', { path: '/socket.io-client' });
    const socket = socketFactory({ ioSocket });

    return {
      socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
         socket.on(modelName + ':save', item => {

          const processedItem = {
            created_at: item.created_at,
            started_at: item.started_at,
            state: item.state,
            type: item.type,
            id: item.id
          };

          let oldItem = _.find(array, {
            id: processedItem.id
          });
          const index = array.indexOf(oldItem);
          let event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            event = processedItem.state === 'complete'
              ? 'processed'
              : 'started';
            array.splice(index, 1, processedItem);
          } else {
            array.push(processedItem);
          }

          const requestID = `${processedItem.type.toUpperCase()} #${processedItem.id}`;

          switch (event) {
            case 'created': {
              toastr.info(`Request '${requestID}' added to queue`);
              break;
            }
            case 'started': {
              toastr.info(`Request '${requestID}' started processing`);
              break;
            }
            case 'processed': {
              toastr.success(`Request '${requestID}' processed`);
              break;
            }
            default: {
              toastr.error(`Request '${requestID}' could not be processed`);
            }
          }
          cb(event, processedItem, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', item => {
          const processedItem = {
            created_at: item.created_at,
            started_at: item.started_at,
            state: item.state,
            type: item.type,
            id: item.id
          };
          const event = 'deleted';
          _.remove(array, {
            id: processedItem.id
          });
          cb(event, processedItem, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates(modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  });
