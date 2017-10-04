import {format} from 'd3-format';
import {map} from 'd3-collection';

const formats = map();

export default function (specifier, value) {
    var fmt = formats.get(specifier);
    if (!fmt) {
        fmt = format(specifier);
        formats.set(specifier, fmt);
    }
    return fmt(value);
}
