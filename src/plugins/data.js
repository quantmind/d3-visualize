import {visualEvents} from '../core/base';
import DataStore from '../data/store';


visualEvents.on('after-init.data', (viz, options) => {
    var visual = viz.visual,
        store = options.dataStore,
        data = options.data;

    if (viz.type === 'visual') setupVisual(viz, options);
    else setupLayer(viz, options);
});


function setupVisual (visual, options) {
    var store = options.dataStore,
        data = options.data;
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
    visual.data = data
}


function setupLayer (layer, options) {
    var visual = layer.visual,
        store = layer.dataStore;

    // no data - do nothing
    if (!store) return;
    
}
