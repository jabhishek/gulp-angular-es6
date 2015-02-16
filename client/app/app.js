(function () {
	'use strict';
	angular.module('angularApp', ['ui.router', 'ngMaterial'])
		.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
			$stateProvider
				.state('main', {
					url: '/',
					templateUrl: 'main/main.html',
					controller: 'MainController',
					controllerAs: 'mainVm'
				});

			$urlRouterProvider.otherwise('/');

			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false
			});
		});
})();
