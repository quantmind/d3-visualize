import {isFunction} from 'd3-let';

export default function (obj, cfg) {
    let keys;
    if (cfg.$events) keys = cfg.$events.keys();
    else keys = Object.keys(cfg);
    keys.forEach(key => {
        if (isFunction(obj[key]))
            obj[key](cfg[key]);
    });
    return obj;
}
