'use strict';

angular.module('reedsyApp', ['btford.socket-io', 'ui.router', 'toastr', 'angular-table'])
  .config(($urlRouterProvider, $locationProvider) => {
	$urlRouterProvider.otherwise('/');

	$locationProvider.html5Mode(true);
});
