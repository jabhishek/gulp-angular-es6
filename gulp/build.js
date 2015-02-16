var gulp = require('gulp');
var runSequence = require('run-sequence');
var minify = require('gulp-minify-css');
var $gulp = require('gulp-load-plugins')({
	lazy: false
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