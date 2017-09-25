//
//  dataStore integration with visuals
import {isString, pop} from 'd3-let';
import {resolvedPromise} from 'd3-view';

import {visuals} from '../core/base';
import DataStore from '../data/store';
import {vizPrototype} from '../core/chart';
import warn from '../utils/warn';


vizPrototype.getData = function () {
    var name = this.model.data;
    if (!name) {
        warn('Visual without data name, cannot get data');
        return resolvedPromise();
    }
    return this.model.dataStore.getData(name);
};


visuals.events.on('before-init.data', viz => {
    if (!viz.isViz) return;
    // remove data from options
    viz.data = pop(viz.options, 'data');
});


visuals.events.on('after-init.data', viz => {
    if (viz.isViz) setupLayer(viz);
    else setupVisual(viz);
});


function setupVisual (visual) {
    var store = visual.model.dataStore,
        data = pop(visual.options, 'data');
    //
    if (!store) {
        store = new DataStore(visual.model);
        visual.model.dataStore = store;
    }
    store.addSources(data);
}


function setupLayer (layer) {
    var store = layer.model.dataStore,
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
