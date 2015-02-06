// Reference:- https://gist.github.com/pgilad/11256601#file-gulpfile-js-L56
var _ = require("lodash");
var gulp = require('gulp');
var path = require('path');
var minify = require('gulp-minify-css');
var $gulp = require('gulp-load-plugins')({
	lazy: false
});
var templateCache = require('gulp-angular-templatecache');
var server = require('gulp-develop-server');
var ngAnnotate = require('gulp-ng-annotate');
var runSequence = require('run-sequence');

var prependBowerPath = function (packageName) {
	return path.join('./client/bower_components/', packageName);
};
var vendorStyles = ['angular-material/angular-material.css', 'angular-material/themes/*']
	.map(prependBowerPath);

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

var appScripts = ['client/app/**/*.js', '!client/app/**/*spec.js'];

gulp.task('jshint', function () {
	return gulp.src(appScripts)
		.pipe($gulp.jshint())
		.pipe($gulp.jshint.reporter('default'));

});

gulp.task('clean:jsTemplates', function () {
	return gulp.src(['./compiled/js/templates*'], {read: false})
		.pipe($gulp.rimraf());
});

gulp.task('clean:jsApp', function () {
	return gulp.src(['./compiled/js/app*'], {read: false})
		.pipe($gulp.rimraf());
});
gulp.task('clean:jsVendors', function () {
	return gulp.src(['./compiled/js/vendors*'], {read: false})
		.pipe($gulp.rimraf());
});
gulp.task('clean:cssApp', function () {
	return gulp.src(['./compiled/css/app*'], {read: false})
		.pipe($gulp.rimraf());
});
gulp.task('clean:cssVendors', function () {
	return gulp.src(['./compiled/css/vendors*'], {read: false})
		.pipe($gulp.rimraf());
});
gulp.task('clean:dist', function () {
	return gulp.src(['./dist/**/*'], {read: false})
		.pipe($gulp.rimraf());
});
gulp.task('vendors:css', ['clean:cssVendors'], function () {
	return gulp.src(vendorStyles)
		.pipe($gulp.concat('vendors.min.css'))
		.pipe(minify())
		.pipe(gulp.dest('compiled/css/'))
		.pipe($gulp.size({showFiles: true}));
});
gulp.task('css', ['clean:cssApp'], function () {
	return gulp.src(['client/app/styles/app.less'])
		.pipe($gulp.less())
		.pipe($gulp.autoprefixer())
		.pipe(minify())
		.pipe(gulp.dest('compiled/css/'))
		.pipe($gulp.size({showFiles: true}));
});

gulp.task('vendors:js', ['clean:jsVendors'], function () {
	return gulp.src(vendorScripts)
		.pipe($gulp.uglify())
		.pipe($gulp.concat('vendors.min.js'))
		.pipe(gulp.dest('compiled/js/'))
		.pipe($gulp.size({showFiles: true}));
});

gulp.task('js', ['clean:jsApp', 'jshint'], function () {
	return gulp.src(appScripts)
		.pipe(ngAnnotate())
		.pipe($gulp.concat('app.min.js'))
		.pipe(gulp.dest('compiled/js/'))
		.pipe($gulp.size({showFiles: true}));
});

gulp.task('templates', ['clean:jsTemplates'], function () {
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
	gulp.watch([ 'client/app/**/*.js' ], ['js']);
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

gulp.task('build', function() {
	"use strict";
	return runSequence('clean:dist', 'html', ['buildStyles', 'buildScripts'], 'buildHtml');
});

gulp.task('buildScripts', function() {
	"use strict";
	return gulp.src('compiled/js/*')
		.pipe($gulp.uglify())
		.pipe($gulp.rev())
		.pipe(gulp.dest('dist/js/'))
		.pipe($gulp.size({showFiles: true}));
});

gulp.task('buildStyles', function() {
	"use strict";
	return gulp.src('compiled/css/*')
		.pipe(minify())
		.pipe($gulp.rev())
		.pipe(gulp.dest('dist/css/'))
		.pipe($gulp.size({showFiles: true}));
});
gulp.task('buildHtml', function() {
	"use strict";
	return gulp.src('./client/index.html')
		.pipe($gulp.inject(gulp.src(['./dist/css/vendors*'], { read: false }), {
			addRootSlash: false,
			ignorePath: 'dist', name: 'cssvendors'
		}))
		.pipe($gulp.inject(gulp.src(['./dist/css/app*'], { read: false }), {
			addRootSlash: false,
			ignorePath: 'dist'
		}))
		.pipe($gulp.inject(gulp.src(['./dist/js/vendors*'], { read: false }), {
			addRootSlash: false,
			ignorePath: 'dist', name: 'jsvendors'
		}))
		.pipe($gulp.inject(gulp.src(['./dist/js/templates*'], { read: false }), {
			addRootSlash: false,
			ignorePath: 'dist', name: 'templates'
		}))
		.pipe($gulp.inject(gulp.src(['./dist/js/app*'], { read: false }), {
			addRootSlash: false,
			ignorePath: 'dist', name: 'app'
		}))
		.pipe($gulp.htmlmin({collapseWhitespace: true, removeComments: true }))
		.pipe(gulp.dest('./dist/'))
		.pipe($gulp.size({showFiles: true}));
});

gulp.task('default', ['server:start', 'watch']);