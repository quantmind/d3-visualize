import assign from 'object-assign';
import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';
import {pop} from 'd3-let';
import crossfilter from 'crossfilter';


const dataEvents = dispatch('init', 'data');


//
//  DataSource prototype
//  ======================
const dataSourcePrototype = {

    // get the config object-assign// This method is used by the prototype
    // to check if the config object is a valid one
    getConfig () {

    },

    // initialise the data source with a config object
    initialise (config) {
        assign(this, config);
    },

    getData () {},

    //
    // given a data object returns a Cross filter object
    asFrame (data) {
        data = data.map(entry => {
            if (entry.constructor !== Object) entry = {data: entry};
            return entry;
        });
        return crossfilter(data);
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
        cf = crossfilter();

    // store.natural = cf.dimension(d => d._id);

    Object.defineProperties(dataSource, {
        cf: {
            get () {
                return cf;
            }
        },
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
        config: {
            get () {
                return config;
            }
        }
    });

    dataSource.initialise(config);
    store.sources.set(name, dataSource);
    dataEvents.call('init', undefined, dataSource);
}
