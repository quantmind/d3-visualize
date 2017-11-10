import {isArray, isObject} from 'd3-let';

//
//  Array DataSource
//  ====================
//
//  Data is given in an array, pkain & simple
export default {
    schema: {
        type: "object",
        description: 'array of data',
        properties: {
            data: {
                type: "array",
                description: "array of data"
            }
        }
    },

    initialise (config) {
        this._data = config.data;
    },

    getConfig (config) {
        if (isArray(config)) return {data: config};
        else if (isObject(config) && isArray(config.data)) return config;
    },

    getData () {
        return this.asFrame(this._data);
    }
};
