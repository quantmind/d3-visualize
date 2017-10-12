import {isArray, isObject} from 'd3-let';
import {resolvedPromise} from 'd3-view';

//
//  Array DataSource
//  ====================
//
//  Data is given in an array, pkain & simple
export default {

    initialise (config) {
        this._data = config.data;
    },

    getConfig (config) {
        if (isArray(config)) return {data: config};
        else if (isObject(config) && isArray(config.data)) return config;
    },

    getData () {
        return resolvedPromise(this.asFrame(this._data));
    }
};
