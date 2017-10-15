import {isObject, isPromise} from 'd3-let';
import {viewExpression} from 'd3-view';


export default {

    initialise (config) {
        this.expression = viewExpression(config.expression);
    },

    getConfig (config) {
        if (isObject(config) && config.expression)
            return config;
    },

    getData () {
        var self = this,
            model = this.store.model,
            result = this.expression.eval(model);
        if (isPromise(result)) return result.then(data => self.asFrame(data));
        else return self.asFrame(result);
    }
};
