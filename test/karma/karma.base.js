module.exports = {

    phantomjsLauncher: {
        exitOnResourceError: true
    },

    basePath: '../../',
    singleRun: true,
    frameworks: ['jasmine', 'browserify', 'es5-shim'],

    files: [
        './node_modules/babel-polyfill/dist/polyfill.js',
        './build/d3-require.js',
        './test/test-*.js'
    ],

    preprocessors: {
        './test/*.js': ['browserify']
    },

    browserify: {
        debug: true,
        transform: [
            [
                'babelify',
                {
                    presets: ["env"],
                    plugins: ["transform-async-to-generator"]
                }
            ]
        ]
    },

    customLaunchers: {
        ChromeNoSandbox: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    }
};
