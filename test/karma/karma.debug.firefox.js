var assign = require('object-assign');
var base = require('./karma.base.js');


module.exports = function (config) {

    var options = assign(base, {
        singleRun: false,
        browsers: ['Firefox']
    });

    config.set(options);
};
