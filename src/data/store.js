import {map} from 'd3-collection';
import {isArray, isString, isPromise, isFunction, assign} from 'd3-let';
import {viewExpression, viewModel} from 'd3-view';

import array from './array';
import remote from './remote';
import composite from './composite';
import expression from './expression';
import dataSources from './sources';
import transformStore from '../transforms/index';
import dataEvents from './events';


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
    this.model = (model && isFunction(model.$child)) ? model : viewModel(model);
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
            var ds = this.sources.get(name);
            this.sources.remove(name);
            dataEvents.call('remove', this, ds);
            return ds;
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
    getData (source, context) {
        var ds = this.sources.get(source);
        if (!ds) throw new Error(`Data source ${source} not available`);
        if (ds.cachedFrame) return Promise.resolve(ds.cachedFrame);
        var data = ds.getData(context);
        if (!isPromise(data)) data = Promise.resolve(data);
        return data.then(frame => {
            if (ds.config.cache) ds.cachedFrame = frame;
            ds.lastFrame = frame;
            dataEvents.call('data', ds.store, ds, frame);
            return frame;
        });
    },

    eval (expr, context) {
        let ctx = this.model.$child(context);
        ctx.dataStore = this;
        return viewExpression(expr).safeEval(ctx);
    },

    // Add a callback to the data event for a specific data source
    // if the data source has already a data frame, trigger the callback
    onData (name, callback) {
        var store = this,
            dsname = name.split('.')[0];
        var ds = this.sources.get(dsname);
        if (ds && ds.lastFrame) callback(ds.lastFrame);
        dataEvents.on('data.' + name, (ds, frame) => {
            if (ds.store === store && ds.name === dsname)
                callback(frame);
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
