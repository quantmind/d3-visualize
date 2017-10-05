import {isArray, isString} from 'd3-let';
import warn from '../utils/warn';

//
// Apply a cross filter to an array of fields
export default function (config) {
    let fields = config.fields,
        query = config.query;

    if (!isArray(fields)) return warn('crossfilter transform expects an array of fields');
    if (!isArray(query)) return warn('crossfilter transform expects an array of query');
    if (query.length != fields.length) return warn('crossfilter transform expects an query array with same length as fields');

    return crossfilter;

    function crossfilter (frame) {
        let dim, q;
        return fields.reduce((df, field, index) => {
            q = query[index];
            if (isString(q)) q = frame.store.eval(q);
            if (q) {
                dim = df.dimension(field);
                df = df.new(dim.filter(q).top(Infinity));
            }
            return df;
        }, frame);
    }
}
