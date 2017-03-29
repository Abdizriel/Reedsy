'use strict';

angular.module('reedsyApp', ['btford.socket-io', 'ui.router', 'toastr'])
  .config(($urlRouterProvider, $locationProvider) => {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
