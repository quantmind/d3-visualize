// Collection of transforms
import groupby from './groupby';

//
//  transforms Store
export default {
    groupby
};


// Apply data transforms to a series
export function applyTransforms (series, transforms) {
    let ts;
    if (!transforms) return series;
    transforms.forEach(transform => {
        ts = transform(series);
        series = ts ? ts : series;
    });
    return series;
}
