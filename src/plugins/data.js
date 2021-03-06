//
//  dataStore integration with visuals
import {isString, pop, assign} from 'd3-let';

import {visuals} from '../core/base';
import DataStore from '../data/store';
import dataSources from '../data/sources';
import {vizPrototype} from '../core/chart';


assign(visuals.schema.definitions, {
    data: {
        type: "array",
        items: {
            '$ref': '#/definitions/dataSource'
        }
    },
    dataSource: {
        oneOf: dataSources.values().map(Ds => {
            const schema = Ds.prototype.schema;
            schema.properties.transforms = {'$ref': '#/definitions/transforms'};
            return schema;
        })
    }
});
//  getData method
//  =====================
//
//  Inject a method for easily retrieving data from the datastore
vizPrototype.getData = function () {
    var name = this.model.data;
    if (!name) {
        this.logWarn(`no data name - cannot get data`);
        return;
    }
    try {
        return this.dataStore.getData(name, {$visual: this});
    } catch (err) {
        this.logError(err);
        return;
    }
};

//
// Context for expression evaluation
vizPrototype.getContext = function (context) {
    return this.dataStore.model.$child(context);
};


visuals.events.on('before-init.data', viz => {
    if (!viz.isViz) return;
    // remove data from options
    viz.data = pop(viz.options, 'data');
});


visuals.events.on('after-init.data', viz => {
    Object.defineProperties(viz, {
        dataStore : {
            get () {
                return viz.model.root.dataStore;
            }
        },
    });
    if (viz.isViz) setupLayer(viz);
    else setupVisual(viz);
});


function setupVisual (visual) {
    var store = visual.dataStore,
        data = pop(visual.options, 'data');
    //
    if (!store) {
        // create the data store for the visual or container
        store = new DataStore(visual.getModel('dataContext'));
        visual.model.root.dataStore = store;
    }
    store.addSources(data);
}


function setupLayer (layer) {
    var store = layer.dataStore,
        data = pop(layer, 'data');
    if (!data) return;
    if (isString(data)) data = {source: data};
    if (!data.name) data.name = layer.model.uid;
    data = store.addSources(data);
    if (data)
        layer.model.$set('data', data.name);
    else
        layer.logWarn(`could not create data source ${data.name}`);
}
