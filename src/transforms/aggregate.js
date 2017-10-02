import {map} from 'd3-collection';
import {isArray, isString} from 'd3-let';
import {max, min, sum, mean, median, variance, deviation} from 'd3-array';

import warn from '../utils/warn';
import fillArray from '../utils/fillarray';

export const operations = map({
    count,
    max,
    min,
    sum,
    mean,
    median,
    variance,
    deviation
});

function count (array, accessor) {
    return array.reduce((v, d) => {
        if (accessor(d) !== undefined) v += 1;
        return v;
    });
}
//
// The aggregate transform groups and summarizes an imput data stream to
// produce a derived output data stream. Aggregate transforms can be used
// to compute counts, sums, averages and other descriptive statistics over
// groups of data objects.
export default function (config) {
    let fields = config.fields,
        ops = config.ops,
        as = config.as;

    if (!fields && !ops) return countAll;

    if (!isArray(fields)) return warn('Aggregate transforms expect an array of fields');
    if (!ops) ops = 'count';
    if (isString(ops)) ops = fillArray(fields.length, ops);
    if (!isArray(ops)) return warn('Aggregate transform expects an array of ops');
    if (ops.length < fields.length) warn('Aggregate transforms expects an ops array with same length as fields');
    if (!as) as = [];
    if (!isArray(as)) return warn('Aggregate transform expects an array of as fields');
    return aggregate;


    function countAll (frame) {
        let key;
        return frame.data.reduce((o, d) => {
            for (key in d) {
                if (key in o) o[key] += 1;
                else o[key] = 1;
            }
            return o;
        }, {});
    }

    function aggregate (frame) {
        var data = [],
            name, op;
        fields.forEach((field, index) => {
            name = ops[index];
            op = count;
            if (name) {
                op = operations.get(name);
                if (!op) {
                    op = count;
                    warn(`Operation ${ops[index]} is not supported, use count`);
                }
            }
            data.push({
                label: as[index] || field,
                data: op(frame.data, d => d[field])
            });
        });
        return data;
    }
}
