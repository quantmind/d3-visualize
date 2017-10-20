import {timeFormat} from 'd3-time-format';
import {map} from 'd3-collection';

const formats = map();

export default function (specifier, value) {
    var fmt = formats.get(specifier);
    if (!fmt) {
        fmt = timeFormat(specifier);
        formats.set(specifier, fmt);
    }
    return fmt(value);
}
