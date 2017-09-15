import {isArray, isObject, pop} from 'd3-let';


export default {

    init (config) {
        if (isArray(config)) return {data: config};
        else if (isObject(config) && isArray(config.data)) return config;
    },

    load () {
        return pop(this.config, 'data');
    }
};
