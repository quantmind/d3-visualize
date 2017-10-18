import assign from 'object-assign';
import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';
import {pop, isArray} from 'd3-let';

import DataFrame from './dataframe';
import transformStore, {applyTransforms} from '../transforms/index';
import warn from '../utils/warn';

const dataEvents = dispatch('init', 'data');


//
//  DataSource prototype
//  ======================
const dataSourcePrototype = {

    // get the config object-assign// This method is used by the prototype
    // to check if the config object is a valid one
    getConfig () {},

    // initialise the data source with a config object
    initialise () {},

    getData () {},

    //
    addTransforms (transforms) {
        var self = this;
        let t;
        if (!transforms) return;
        if (!isArray(transforms)) transforms = [transforms];
        transforms.forEach(transform => {
            t = transformStore.get(transform.type);
            if (!t) warn(`Transform type "${transform.type}" not known`);
            else self.transforms.push(t(transform));
        });
    },
    //
    // given a data object returns a Cross filter object
    asFrame (data) {
        if (isArray(data)) {
            data = data.map(entry => {
                if (entry.constructor !== Object) entry = {data: entry};
                return entry;
            });
            data = new DataFrame(data, null, this.store);
        }
        return applyTransforms(data, this.transforms);
    }
};


// DataSource container
export default assign(map(), {
    events: dataEvents,

    add (type, source) {

        // DataSource constructor
        function DataSource (config, store) {
            initDataSource(this, type, config, store);
        }

        DataSource.prototype = assign({}, dataSourcePrototype, source);

        this.set(type, DataSource);
        return DataSource;
    },

    // Create a new DataSource
    create (config, store) {
        var sources = this.values(),
            cfg;
        for (var i=0; i<sources.length; ++i) {
            cfg = sources[i].prototype.getConfig(config);
            if (cfg) return new sources[i](cfg, store);
        }
    }
});


function initDataSource(dataSource, type, config, store) {

    var name = store.dataName(pop(config, 'name')),
        transforms = [];

    // store.natural = cf.dimension(d => d._id);

    Object.defineProperties(dataSource, {
        name: {
            get () {
                return name;
            }
        },
        store: {
            get () {
                return store;
            }
        },
        type: {
            get () {
                return type;
            }
        },
        // transforms to apply to data
        transforms: {
            get () {
                return transforms;
            }
        },
        config: {
            get () {
                return config;
            }
        }
    });

    dataSource.initialise(config);
    dataSource.addTransforms(pop(config, 'transforms'));
    store.sources.set(name, dataSource);
    dataEvents.call('init', undefined, dataSource);
}
