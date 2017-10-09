import assign from 'object-assign';

import transformFactory from './base';

//
// Create a groupby transform from a config object
export default transformFactory ({
    schema: {
        description: "Perfrom a cumulative summation for a group of fields along a dimension. It is possible to perform the cumulative summation for different groups",
        properties: {
            dimension: {
                type: "string"
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
        required: ["fields"]
    },
    transform (frame, config) {
        var as = config.as || [],
            data = [];

        if (config.groupby) {
            var g = frame.dimension(config.groupby),
                groups = g.group().all();
            groups.forEach(d => cumulate(frame.new(g.filterAll().filter(d.key).top(Infinity)), data));
        } else {
            cumulate(frame.new(), data);
        }

        function cumulate(df) {
             var dim = df.dimension(config.dimension),
                 cum = config.fields.reduce((o, key) => {
                     o[key] = 0;
                     return o;
                 }, {});

            dim.top(Infinity).forEach(d => {
                d = assign({}, d);
                config.fields.forEach((field, index) => {
                    cum[field] += d[field];
                    d[as[index] || field] = cum[field];
                });
                data.push(d);
            });
        }
    }
});
