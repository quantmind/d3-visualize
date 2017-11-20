<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Tranforms](#tranforms)
  - [Add Tranforms](#add-tranforms)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Tranforms

Transforms process a data frame to filter data, calculate new fields,
or derive new data frames. Transforms are typically specified within the
transform array of a data definition.
In addition, transforms that do not filter or generate new data objects can
be used within the transform array of a mark definition to
specify post-encoding transforms.


## Add Tranforms

To add a new transform to the collection of available transforms:
```javascript
import {visualTransforms} from 'd3-visualize';

visualTransforms.add('mytransform', {
    schema: {
    },
    transform (frame, config) {
        ...
    }
});
```

The optional ``schema`` object is used to validate transform config parameters. If not provided no validation is performed.
