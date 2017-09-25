import assign from 'object-assign';

import {map} from 'd3-collection';
import {isArray, isString} from 'd3-let';
import {resolvedPromise} from 'd3-view';

import array from './array';
import remote from './remote';
import composite from './composite';
import expression from './expression';
import dataSources from './sources';
import transformStore from '../transforms/index';


dataSources.add('array', array);
dataSources.add('remote', remote);
dataSources.add('composite', composite);
dataSources.add('expression', expression);

//
//  DataStore
//  ==============
//
//  Map names to datasets
//  Individual data sets are assumed to contain a collection of records
//  (or “rows”), which may contain any number of named data
//  attributes (fields, or “columns”).
//  Records are modeled using standard JavaScript objects.
export default function DataStore(model) {
    var sources = map();

    Object.defineProperties(this, {
        sources: {
            get () {
                return sources;
            }
        }
    });

    // transforms function
    this.transforms = assign({}, transformStore);
    this.dataCount = 0;
    this.model = model;
}


DataStore.prototype = {
    size () {
        return this.sources.size();
    },

    // Add a new serie from a data source
    addSources (config) {
        //
        // data is a string, it must be already registered with store
        if (isString(config)) config = {source: config};

        if (isArray(config)) {
            var self = this;
            return config.map(cfg => {
                return dataSources.create(cfg, self);
            });
        } else if (config) {
            return dataSources.create(config, this);
        }
    },

    addTransforms (transforms) {
        assign(this.transforms, transforms);
    },

    // set, get or remove a data source
    source (name, source) {
        if (arguments.length === 1) return this.sources.get(name);
        if (source === null) {
            var p = this.sources.get(name);
            this.sources.remove(name);
            return p;
        }
        this.sources.set(name, source);
        return this;
    },

    clearCache () {
        this.sources.each(ds => {
            delete ds.cachedFrame;
        });
    },

    // get data from a source
    getData (source) {
        var ds = this.sources.get(source);
        if (!ds) throw new Error(`Data source ${source} not available`);
        if (ds.cachedFrame) return resolvedPromise(ds.cachedFrame);
        return ds.getData().then(frame => {
            ds.cachedFrame = frame;
            return frame;
        });
    },

    dataName (name) {
        this.dataCount++;
        if (name) return '' + name;
        var def = this.source('default');
        if (!def) return 'default';
        return `source${this.dataCount}`;
    }
};
