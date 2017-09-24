import {isObject} from 'd3-let';
import {viewExpression} from 'd3-view';
import {resolvedPromise} from 'd3-view';


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
            model = this.store.model;
        return resolvedPromise(this.expression.eval(model)).then((data) => self.asFrame(data));
    }
};
