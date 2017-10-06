# Tranforms

Transforms process a data frame to filter data, calculate new fields,
or derive new data frames. Transforms are typically specified within the
transform array of a data definition.
In addition, transforms that do not filter or generate new data objects can
be used within the transform array of a mark definition to
specify post-encoding transforms.


## Add Tranforms

To add a transform to the collection of available transforms:
```javascript
import {visualTransforms} from 'd3-visualize';

visualTransforms.set('mytransform', config => {

    return mytransform;

    frunction mytransform (frame) {
        ...
    }
});
```
