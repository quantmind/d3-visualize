// Collection of transforms
import {map} from 'd3-collection';
import {isArray, isPromise, assign} from 'd3-let';

import transform from './base';
import filter from './filter';
import aggregate from './aggregate';
import crossfilter from './crossfilter';
import timeseries from './timeseries';
import mapfields from './mapfields';
import movingaverage from './moving-average';
import groupsmall from './group-small';
import diff from './diff';

//
//  transforms Store
export default assign(map({
    filter,
    aggregate,
    mapfields,
    timeseries,
    crossfilter,
    movingaverage,
    groupsmall,
    diff
}), {
    add (name, o) {
        this.set(name, transform(o));
    }
});


//  Apply data transforms to a series
//  Allow for asynchronous transforms
export function applyTransforms (frame, transforms) {
    if (!transforms) return frame;
    return applyt(frame, transforms.slice());
}

function applyt (frame, transforms, res) {
    if (isArray(res)) frame = frame.new(res);
    else if (res) frame = res;
    if (transforms.length) {
        var transform = transforms.splice(0, 1)[0],
            ts = transform ? transform(frame) : null;
        if (isPromise(ts)) return ts.then(res => applyt(frame, transforms, res));
        else return applyt(frame, transforms, ts);
    }
    return frame;
}
