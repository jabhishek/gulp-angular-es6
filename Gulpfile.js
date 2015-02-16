// Reference:- https://gist.github.com/pgilad/11256601#file-gulpfile-js-L56
var _ = require("lodash");
require("./gulp/tests");
require("./gulp/build");
var variables = require("./gulp/variables");

var gulp = require('gulp');
var path = require('path');
var minify = require('gulp-minify-css');
var $gulp = require('gulp-load-plugins')({
	lazy: false
});
var templateCache = require('gulp-angular-templatecache');
var server = require('gulp-develop-server');
var ngAnnotate = require('gulp-ng-annotate');

var to5 = require("gulp-6to5");

gulp.task('jshint', function () {
	return gulp.src(variables.es6Scripts)
		.pipe($gulp.jshint())
		.pipe($gulp.jshint.reporter('default'));

});

gulp.task('clean:dist', function () {
	return gulp.src(['./dist/**/*'], {read: false})
		.pipe($gulp.rimraf());
});
gulp.task('vendors:css', function () {
	return gulp.src(variables.vendorStyles)
		.pipe($gulp.concat('vendors.min.css'))
		.pipe(minify())
		.pipe(gulp.dest('compiled/css/'))
		.pipe($gulp.size({showFiles: true}));
});
gulp.task('css', function () {
	return gulp.src(['client/app/styles/app.less'])
		.pipe($gulp.less())
		.pipe($gulp.autoprefixer())
		.pipe(minify())
		.pipe(gulp.dest('compiled/css/'))
		.pipe($gulp.size({showFiles: true}));
});

gulp.task('vendors:js', function () {
	return gulp.src(variables.vendorScripts)
		.pipe($gulp.uglify())
		.pipe($gulp.concat('vendors.min.js'))
		.pipe(gulp.dest('compiled/js/'))
		.pipe($gulp.size({showFiles: true}));
});

gulp.task("6to5", ['jshint'], function() {
	return gulp.src(variables.es6Scripts)
		.pipe(to5({
			experimental: true
		}))
		.pipe(gulp.dest('client/app/es5/'));
});

gulp.task('js', ['6to5'], function () {
	return gulp.src(variables.es5Scripts)
		.pipe(ngAnnotate())
		.pipe($gulp.concat('app.min.js'))
		.pipe(gulp.dest('compiled/js/'))
		.pipe($gulp.size({showFiles: true}));
});

gulp.task('templates', function () {
	return gulp.src('client/app/**/*.html')
		.pipe(templateCache({ module: 'angularApp' }))
		.pipe(ngAnnotate())
		.pipe($gulp.uglify())
		.pipe(gulp.dest('compiled/js'));
});


gulp.task('server:start', ['html'], function() {
	"use strict";
	server.listen({path: 'server/app.js'}, $gulp.livereload.listen);
});

// restart server if app.js changed
gulp.task('watch', function () {
	gulp.watch([ 'server/**/*.js'], ['server:restart']);
	gulp.watch(variables.es6Scripts, ['js']);
	gulp.watch([ 'client/app/**/*.less' ], ['css']);
	gulp.watch([ 'client/app/**/*.html' ], ['templates']);
	gulp.watch([ 'client/*.html' ], ['html']);

	gulp.watch([
		'compiled/**/*'
	], $gulp.livereload.changed);
});

// restart server if app.js changed
gulp.task('server:restart', function () {
	function restart() {
		server.changed( function( error ) {
			if( ! error ) $gulp.livereload.changed();
		});
	}
	restart();
});

gulp.task('html', ['vendors:css', 'css', 'vendors:js', 'js', 'templates'], function () {
	return gulp.src('./client/index.html')
		.pipe($gulp.inject(gulp.src(['./compiled/css/vendors*'], { read: false }), {
			addRootSlash: false,
			ignorePath: 'compiled', name: 'cssvendors'
		}))
		.pipe($gulp.inject(gulp.src(['./compiled/css/app*'], { read: false }), {
			addRootSlash: false,
			ignorePath: 'compiled'
		}))
		.pipe($gulp.inject(gulp.src(['./compiled/js/vendors*'], { read: false }), {
			addRootSlash: false,
			ignorePath: 'compiled', name: 'jsvendors'
		}))
		.pipe($gulp.inject(gulp.src(['./compiled/js/templates*'], { read: false }), {
			addRootSlash: false,
			ignorePath: 'compiled', name: 'templates'
		}))
		.pipe($gulp.inject(gulp.src(['./compiled/js/app*'], { read: false }), {
			addRootSlash: false,
			ignorePath: 'compiled', name: 'app'
		}))
		//.pipe($gulp.htmlmin({collapseWhitespace: true, removeComments: true }))
		.pipe(gulp.dest('./compiled/'))
		.pipe($gulp.size({showFiles: true}));
});

gulp.task('default', ['server:start', 'watch']);