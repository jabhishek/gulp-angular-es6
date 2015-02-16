// Karma configuration
// Generated on Fri Sep 26 2014 22:18:38 GMT+0100 (GMT Daylight Time)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/6to5/browser-polyfill.js',
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            'client/bower_components/angular-ui-router/release/angular-ui-router.js',
            'client/bower_components/angular-animate/angular-animate.js',
            'client/bower_components/angular-cookies/angular-cookies.js',
            'client/bower_components/restangular/dist/restangular.js',
			'client/bower_components/angular-aria/angular-aria.js',
			'client/bower_components/hammerjs/hammer.js',
            'client/bower_components/angular-material/angular-material.js',
            'client/app/**/*.js',
            'client/app/**/*.html'
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

        preprocessors: {
            "client/app/**/*.js": ["babel"]
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'client/app/'
        },

        plugins: [
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
            'karma-babel-preprocessor',
			'karma-phantomjs-launcher'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
