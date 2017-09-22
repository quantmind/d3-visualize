import assign from 'object-assign';
import {map} from 'd3-collection';
import {dispatch} from 'd3-dispatch';
import {isPromise, pop} from 'd3-let';
import crossfilter from 'crossfilter';


const dataEvents = dispatch('init', 'data');


const dataSourcePrototype = {

    init () {

    },

    size () {
        return this.cf.size();
    },

    load () {

    },

    data (cfg, data) {
        if (arguments.length === 2)
            return this.add(data);
        else {
            var self = this;
            data = this.load();
            if (isPromise(data))
                return data.then((d) => {
                    self.data(cfg, d);
                });
            return this.data(cfg, data);
        }
    },

    // add data to the serie
    add (data) {
        if (!data) return this;
        var size = this.size();
        data = data.map(entry => {
            if (entry && entry.constructor === Object) entry._id = ++size;
            else entry = {_id: ++size, data: entry};
            return entry;
        });
        this.cf.add(data);
        dataEvents.call('data', this, data);
        return this;
    }
};


// DataSource container
export default assign(map(), {
    events: dataEvents,

    add (type, source) {

        function DataSource (config, store) {
            initDataSource(this, type, config, store);
        }

        DataSource.prototype = assign({}, dataSourcePrototype, source);

        this.set(type, DataSource);
        return DataSource;
    },

    // Create a DataSource for a dataStore
    create (config, store) {
        var sources = this.values(),
            cfg;
        for (var i=0; i<sources.length; ++i) {
            cfg = sources[i].prototype.init(config);
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

    store.series.set(name, dataSource);
    dataEvents.call('init', dataSource);
    // load data
    dataSource.data();
}
