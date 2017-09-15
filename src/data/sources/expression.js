import {isString, isObject} from 'd3-let';
import {viewExpression} from 'd3-view';
import isUrl from '../../utils/isurl';


export default {

    init (config) {
        var opts;
        if (isUrl(config)) return;
        else if (isString(config)) return {expression: config};
        else if (isObject(config) && config.type === 'expression')
            return config;
            opts = config;
        if (opts) {
            this.name = opts.name || this.dataName();
            this.expression = viewExpression(opts.expression);
            return this;
        }
    },

    load () {
        if (!this.expression) this.expression = viewExpression(this.config.expression);
        var model = this.store.model;
        return this.expression.eval(model);
    }
};
