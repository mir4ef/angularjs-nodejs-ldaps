// Karma configuration
// Generated on Tue Jun 21 2016 11:17:39 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './public',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
        'libs/angular/angular.min.js',
        'libs/angular-animate/angular-animate.min.js',
        'libs/angular-aria/angular-aria.min.js',
        'libs/angular-messages/angular-messages.min.js',
        'libs/angular-resource/angular-resource.min.js',
        'libs/angular-route/angular-route.min.js',
        'libs/angular-mocks/angular-mocks.js',
        'app/**/*.module.js',
        'app/**/**/*.module.js',
        'app/*!(.module|.spec).js',
        'app/**/*!(.module|.spec).js',
        'app/**/**/*!(.module|.spec).js',
        'app/*.spec.js',
        'app/**/*.spec.js',
        'app/**/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'app/!(*.spec).js': ['coverage'],
        'app/**/!(*.spec).js': ['coverage'],
        'app/**/**/!(*.spec).js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage', 'bamboo'],


    coverageReporter: {
      reporters: [
          { type: 'html', dir: __dirname + '/test-reports', subdir: 'html' },
          { type: 'text-summary' },
          { type: 'clover', dir: __dirname + '/test-reports', subdir: '.', file: 'clover.xml' }
      ]
    },


    bambooReporter: {
      filename: 'test-reports/util.mocha.json' //optional, defaults to "mocha.json"
    },


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
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
