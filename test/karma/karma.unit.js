var os = require('os');

var assign = require('object-assign');
var base = require('./karma.base.js');



function browsers (b) {
    if (os.platform() === 'darwin') b.push('Safari');
    return b;
}


module.exports = function (config) {

    var options = assign(base, {
        browsers: browsers(['Chrome', 'Firefox'])
    });

    if(process.env.TRAVIS || process.env.CIRCLECI) {
        options.browsers = browsers(['ChromeNoSandbox', 'Firefox']);
    }

    config.set(options);
};
