import {isArray, isObject} from 'd3-let';


export default function clone (o) {
    if (isArray(o)) return o.map(clone);
    else if (isObject(o)) {
        var v = {};
        for (let key in o) {
            v[key] = clone(o[key]);
        }
        return v;
    } else return o;
}
