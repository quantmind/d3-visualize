import {isFunction} from 'd3-let';

import constant from './constant';

export default function (v) {
    if (isFunction(v)) return v;
    return constant(v);
}
