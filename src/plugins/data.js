//
//  dataStore integration with visuals
import {isString, pop} from 'd3-let';
import {resolvedPromise} from 'd3-view';

import {visuals} from '../core/base';
import DataStore from '../data/store';
import {vizPrototype} from '../core/chart';
import warn from '../utils/warn';
import cachedFormat from '../utils/format';

//
// Visual Data Context
visuals.options.dataContext = {
    $format: cachedFormat
};

//
//  Additional data required by visuals
visuals.options.metadata = {

}

//  getData method
//  =====================
//
//  Inject a method for easily retrieving data from the datastore
vizPrototype.getData = function () {
    var name = this.model.data;
    if (!name) {
        warn(`Visual ${this.visualType} without data name, cannot get data`);
        return resolvedPromise();
    }
    return this.dataStore.getData(name);
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
                if (viz.visualParent) return viz.visualParent.dataStore;
                return viz.model.dataStore;
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
        visual.model.dataStore = store;
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
        warn(`Could not create data source ${data.name}`);
}
