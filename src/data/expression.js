import {isObject, isPromise} from 'd3-let';
import {viewExpression} from 'd3-view';


export default {
    schema: {
        type: "object",
        description: 'Expression to evaluate by the data store',
        properties: {
            expression: {
                type: "string",
                description: "expression to evaluate, must return a data frame or a Promise"
            }
        }
    },

    initialise (config) {
        this.expression = viewExpression(config.expression);
    },

    getConfig (config) {
        if (isObject(config) && config.expression)
            return config;
    },

    getData (context) {
        var self = this,
            model = this.store.model.$child(context),
            result = this.expression.eval(model);
        if (isPromise(result)) return result.then(data => self.asFrame(data));
        else return self.asFrame(result);
    }
};
