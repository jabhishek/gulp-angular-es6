var gulp = require('gulp');
var $gulp = require('gulp-load-plugins')({
	lazy: false
});

var protractor = require("gulp-protractor").protractor;
var server = require('gulp-develop-server');

gulp.task('set-env:test', function () {
	return $gulp.env({
		vars: {
			NODE_ENV: 'test'
		}
	});
});
var karma = require('karma').server;
gulp.task('karma', ['set-env:test'], function (done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: false
	}, done);
});

gulp.task('protractor', function () {
	server.listen({ env: { NODE_ENV: 'test'}, path: 'server/app.js'});
	return gulp.src(["./e2eTests/**/*.js"])
		.pipe(protractor({
			configFile: "protractor.config.js"
		}));
});
