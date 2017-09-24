import assign from 'object-assign';
import {isString, isObject} from 'd3-let';

import DataStore from '../data/store';

//
//  vizComponent base prototype
//  =============================
//
//  Some common properties and methods for all visualize components
//
export const vizComponent = {
    props: [
        'schema',	    // Schema is a collection of fields to display in the table
        'datasource',	// Data source
        'plugins',      // list of string/objects
	],

    render (props, attrs, el) {
        var self = this,
            inner = this.select(el).html();
        //
        // make sure data store exists
        this.dataStore();
        //
        // build
        return this.getSchema(props.schema, schema => {
            if (!isObject(schema)) schema = {};
            return self.build(schema, inner);
        });
    },

    // get the schema from the input schema property
    getSchema (input, build) {
        var dashboard = this.model.dashboard;

        // allow to specify the schema as an entry of
        // visuals object in the dashboard schema
        if (dashboard && dashboard !== this.model && isString(input)) {
            var schema = dashboard.schema.visuals[input];
            if (schema) input = schema;
        }

        if (isString(input)) {
            return this.json(input).then(build);
        }
        else return build(input);
    },

    //  Get the datastore associated with this component
    //  If no datastore available, create one
    dataStore () {
        var store = this.model.dataStore;

        if (!store) {
            store = new DataStore(this.model);
            this.model.dataStore = store;
        }
        return store;
    },
    //
    // build the visual component has the schema available
    build () {}
};
//
//  Dashboard Component
//  ========================
//
//  A collection of visual components arranged according
//  to a custom layout.
//
//  * Dashboard visuals are independent of each other but
//    interact via the data object
//  * The Dashboard layout is given by the inner HTML elements
//  * The configuration is obtained via the schema property which
//    can be either:
//      1) an object
//      2) a url
export default assign({}, vizComponent, {

    build (schema, inner) {
        var model = this.model;
        // Set itself as the visualGroup
        model.dashboard = model;
        model.schema = schema;
        if (!schema.visuals) schema.visuals = {};
        // collection of visuals
        model.visuals = [];
        // model.visuals = schema.visuals;
        // self.model.$set('dashboard', schema);
        var sel = this.createElement('div')
                        .classed('dashboard', true);
        return this.mountInner(sel, inner);
    }
});
