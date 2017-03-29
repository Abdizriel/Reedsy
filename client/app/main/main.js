'use strict';

angular.module('reedsyApp')
  .config($stateProvider => {
    $stateProvider.state('main', {
      url: '/',
      template: '<main></main>'
    });
  });
