import {viewExpression} from 'd3-view';

import transformFactory from './base';

//
// Create a groupby transform from a config object
export default transformFactory ({
    schema: {
        description: "The filter transform removes objects from a data frame based on a provided filter expression",
        properties: {
            expr: {
                type: "string"
            }
        },
        required: ["expr"]
    },
    transform (frame, config) {
        var expr = viewExpression(config.expr);
        return frame.data.reduce((data, d, index) => {
            if (expr.safeEval({d: d, index: index, frame: frame})) data.push(d);
            return data;
        }, []);
    }
});
