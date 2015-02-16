
(function (app) {
	'use strict';
	var _message = Symbol('message');
	class MainController {
		constructor() {
			this[_message] = 'Hello ES6!!';
		}

		get message() {
			return this[_message];
		}
	}

	app.controller('MainController', MainController);
})(angular.module('angularApp'));
