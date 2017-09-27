import warn from '../utils/warn';

//
// Create a groupby transform from a config object
export default function (config) {
    var sortby = config.sortby,
        groupby = config.groupby;

    if (!sortby) warn('timeseries transform requires a "sortby" entry');

    return timeseries;

    function timeseries (frame) {
        if (sortby) {
            if (groupby) {
                var dim = frame.dimension(groupby),
                    groups = dim.group().top(Infinity),
                    newframe = frame.new([]),
                    tmp;
                groups.forEach(group => {
                    tmp = frame.new(dim.filterExact(group.key).top(Infinity)).dimension(sortby).group().top(Infinity);
                    newframe.series.set(group.key, frame.new(tmp).dimension('key').top(Infinity));
                });
                return newframe;
            } else {
                return frame.new(frame.dimension(sortby).top(Infinity));
            }
        }
        return frame;
    }
}
