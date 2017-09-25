import {isArray, isObject} from 'd3-let';
//
//  Remote dataSource
//  ===================
//
//  handle Json and csv data
export default {

    getConfig (config) {
        if (isObject(config) && config.source) {
            if (!isArray(config.source)) config.source = [config.source];
            return config;
        }
    },

    getData () {
        var store = this.store;
        return Promise.all(this.source.map(source => {
            return store.getData(source);
        })).then(frames => {
            if (frames.length === 1) return frames[0];
            return frames[0];
        });
    }
};
