var gulp = require('gulp');
var $gulp = require('gulp-load-plugins')({
	lazy: false
});

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