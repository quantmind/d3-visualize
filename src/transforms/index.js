// Collection of transforms
import {map} from 'd3-collection';

import filter from './filter';
import timeseries from './timeseries';
import mapfields from './mapfields';

//
//  transforms Store
export default map({
    filter,
    mapfields,
    timeseries
});


// Apply data transforms to a series
export function applyTransforms (frame, transforms) {
    let ts;
    if (!transforms) return frame;
    transforms.forEach(transform => {
        ts = transform(frame);
        frame = ts ? ts : frame;
    });
    return frame;
}
