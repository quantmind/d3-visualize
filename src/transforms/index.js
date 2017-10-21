// Collection of transforms
import {map} from 'd3-collection';
import {isArray} from 'd3-let';

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
export default map({
    filter,
    aggregate,
    mapfields,
    timeseries,
    crossfilter,
    movingaverage,
    groupsmall,
    diff
});


// Apply data transforms to a series
export function applyTransforms (frame, transforms) {
    let ts;
    if (!transforms) return frame;
    transforms.forEach(transform => {
        if (transform) {
            ts = transform(frame);
            if (isArray(ts)) frame = frame.new(ts);
            else if (ts) frame = ts;
        }
    });
    return frame;
}
