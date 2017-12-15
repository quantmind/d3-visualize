var assign = require('object-assign');
var base = require('./karma.base.js');


module.exports = function (config) {

    var options = assign(base, {

        browsers: ['Chrome'],

        reporters: ['progress', 'coverage'],

        preprocessors: {
            './test/*.js': ['browserify'],
            './src/**/*.js': ['browserify', 'coverage']
        },

        coverageReporter: {
            dir : 'build/coverage/',
            reporters: [
                {
                    type: 'lcov',
                    subdir: '.'
                },
                {
                    type : 'html',
                    subdir: '.'
                },
                {
                    type : 'text',
                    subdir: '.'
                }
            ]
        },

        browserify: {
            debug: true,
            transform: [
                ['babelify', {plugins: 'istanbul'}]
            ]
        }
    });

    if(process.env.TRAVIS || process.env.CIRCLECI) {
        options.browsers = ['PhantomJS', 'ChromeNoSandbox', 'Firefox'];
    }

    config.set(options);
};
