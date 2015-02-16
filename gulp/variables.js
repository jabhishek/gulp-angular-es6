var path = require('path');
var prependBowerPath = function (packageName) {
	return path.join('./client/bower_components/', packageName);
};

var vendorScripts = ['angular/angular.js',
	'angular-ui-router/release/angular-ui-router.js',
	'angular-animate/angular-animate.js',
	'angular-local-storage/dist/angular-local-storage.js',
	'lodash/dist/lodash.js',
	'restangular/dist/restangular.js',
	'angular-cookies/angular-cookies.js',
	'angular-aria/angular-aria.js',
	'hammerjs/hammer.js',
	'angular-material/angular-material.js']
	.map(prependBowerPath);

//  browser-polyfill for es6
vendorScripts.splice(vendorScripts.length, 0, path.join('./node_modules', '6to5/browser-polyfill.js'));

var es6Scripts = ['client/app/**/*.js', '!client/app/**/*spec.js', '!client/app/es5/**/*.js'];
var es5Scripts = ['client/app/es5/**/*.js', '!client/app/es5/**/*spec.js'];
var vendorStyles = ['angular-material/angular-material.css', 'angular-material/themes/*']
	.map(prependBowerPath);


module.exports = {
	vendorScripts: vendorScripts,
	es6Scripts: es6Scripts,
	es5Scripts: es5Scripts,
	vendorStyles: vendorStyles
};