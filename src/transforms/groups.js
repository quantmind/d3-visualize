import {extent} from 'd3-array';

//
//  Create a Grouper generator
//  ===============================
//
//  This is a chart transform rather than a data transform
export default function () {
    var groupby = null,
        x = 'x',
        y = 'y',
        sort = false,
        stack = null,
        normalize = false;

    function grouper (frame) {
        let stacked = false,
            data, labels, s;

        if (groupby) {
            labels = frame.dimension(groupby).group().top(Infinity).map(g => g['key']);
            if (labels.length <= 1) labels = null;
        }

        if (labels) {
            frame = frame.pivot(x, groupby, y);
            if (sort) frame = frame.sortby('total');
            data = frame.data;
            if (stack) {
                if (normalize)
                    data = normalizeData(data);
                data = stack.keys(labels)(data);
                stacked = true;
            }
        } else {
            data = frame.data;
            labels = [y];
        }

        if (!stacked)
            data = labels.map((key, index) => {
                s = data.map(d => {
                    s = [0, d[key]];
                    s.data = d;
                    return s;
                });
                s.index = index;
                s.key = key;
                return s;
            });

        return new GroupedData(data, x, y, stacked);
    }

    grouper.groupby = function(_) {
        if (arguments.length) {
            groupby = _;
            return grouper;
        }
        return groupby;
    };

    grouper.x = function(_) {
        return arguments.length ? (x = _, grouper) : x;
    };

    grouper.y = function(_) {
        return arguments.length ? (y = _, grouper) : y;
    };

    grouper.normalize = function(_) {
        return arguments.length ? (normalize = _, grouper) : normalize;
    };

    grouper.stack = function(_) {
        return arguments.length ? (stack = _, grouper) : stack;
    };

    return grouper;
}


function GroupedData (data, x, y, stacked) {
    this.data = data;
    this.stacked = stacked;
    this.x = x;
    this.y = y;
}

GroupedData.prototype = {
    rangeX () {
        return this.range(this.x);
    },
    rangeY () {
        return this.range();
    },
    range (key) {
        let range, vals;
        if (key)
            vals = this.data.reduce((a, d) => {
                range = extent(d, acc);
                a.push(range[0]);
                a.push(range[1]);
                return a;
            }, []);
        else
        vals = this.data.reduce((a, d) => {
            range = extent(d, acc0);
            a.push(range[0]);
            a.push(range[1]);
            range = extent(d, acc1);
            a.push(range[0]);
            a.push(range[1]);
            return a;
        }, []);
        return extent(vals);

        function acc0 (d) {
            return d[0];
        }

        function acc1 (d) {
            return d[1];
        }

        function acc (d) {
            return d.data[key];
        }
    }
};


function normalizeData (data) {
    return data;
}
