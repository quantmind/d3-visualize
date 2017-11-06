import {assign} from 'd3-let';

import transformFactory from './base';

//
// First order difference along a dimension for a group of fields
export default transformFactory ({
    schema: {
        description: "Perfrom a difference for a group of fields along a dimension. It is possible to perform a difference for different groups",
        properties: {
            dimension: {
                type: "string"
            },
            period: {
                type: "integer",
                minimum: 1
            },
            fields: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            as: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            groupby: {
                type: "string"
            }
        },
        required: ["dimension", "fields"]
    },
    transform (frame, config) {
        var as = config.as || [],
            period = config.period || 1,
            data = [];

        if (config.groupby) {
            var g = frame.dimension(config.groupby),
                groups = g.group().all();
            groups.forEach(d => difference(frame.new(g.filterAll().filter(d.key).top(Infinity))));
        } else {
            difference(frame.new());
        }

        return data;

        function difference (df) {
            var dim = df.dimension(config.dimension),
                zeros = config.fields.reduce((z, field) => {z[field] = 0; return z;}, {}),
                stack = [];
            let dd, prev;

            dim.top(Infinity).forEach((d, index) => {
                dd = assign({}, d);
                stack.push(d);
                if (index > period) prev = stack.splice(0, 1)[0];
                else prev = zeros;
                config.fields.forEach((field, index) => {
                    d[as[index] || field] = d[field] - prev[field];
                });
                data.push(dd);
            });
        }
    }
});
