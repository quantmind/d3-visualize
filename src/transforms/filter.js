import warn from '../utils/warn';

//
// Create a groupby transform from a config object
export default function (config) {
    var dimension = config.dimension;

    if (!dimension) warn('Filter transform requires a "dimenstion" entry');

    return filter;

    function filter (frame) {
        if (dimension) {
            var d = frame.dimension(dimension);
            return frame.new(d.group());
        }
    }
}
