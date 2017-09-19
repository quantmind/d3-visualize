//
//  dataStore integration with visuals
import {isString, pop} from 'd3-let';
import {visualEvents} from '../core/base';
import DataStore from '../data/store';


visualEvents.on('after-init.data', (viz, options) => {
    if (viz.visualType === 'visual') setupVisual(viz, options);
    else setupLayer(viz, options);
});


function setupVisual (visual, options) {
    var store = options.dataStore,
        data = pop(options, 'data');
    //
    // No data entry - skip data setup
    if (!data) return;
    //
    if (!store) store = new DataStore();

    visual.dataStore = store;
    //
    // data is a string, it must be already registered with store
    if (isString(data)) data = {name: data};

    if (!store.get(data.name)) {
        data = store.add(data);
    }
    visual.data = data;
}


function setupLayer (layer, options) {
    var visual = layer.visual,
        store = visual.dataStore,
        data = options.data;

    // no data - do nothing
    if (!store) return;

    if (data) layer.data = data;
}
