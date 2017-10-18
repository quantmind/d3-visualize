import {sum} from 'd3-array';

import accessor from '../utils/accessor';
import transformFactory from './base';

//
// Create a groupby transform from a config object
export default transformFactory ({
    schema: {
        description: "Group entries which are below a given aggregate cutoff",
        properties: {
            field: {
                type: "string"
            },
            cutoff: {
                type: "number"
            }
        },
        required: ["field", "cutoff"]
    },
    transform (frame, config) {
        var get = accessor(config.field),
            total = sum(frame.data, get);
        let children = [],
            aggregate = 0;
        return frame.dimension(config.field).bottom(Infinity).reduce((data, d) => {
            aggregate += get(d);
            if (aggregate/total < config.cutoff) children.push(d);
            else if (children) {
                children.push(d);
                d = {
                    label: 'other',
                    children: children
                };
                d[config.field] = aggregate;
                children = null;
                data.push(d);
            } else
                data.push(d);
            return data;
        }, []);
    }
});
