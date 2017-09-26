import assign from 'object-assign';
import {isString, isObject} from 'd3-let';

import VisualContainer from '../core/container';

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
        // build
        return this.getSchema(props.schema, schema => {
            if (!isObject(schema)) schema = {};
            return self.build(schema, inner, attrs);
        });
    },

    // get the schema from the input schema property
    getSchema (input, build) {
        var parent = this.model.visual;

        // allow to specify the schema as an entry of
        // visuals object in the dashboard schema
        if (parent && parent !== this.model && isString(input)) {
            var schema = parent.options.visuals[input];
            if (schema) input = schema;
        }

        if (isString(input)) {
            return this.json(input).then(build);
        }
        else return build(input);
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

    build (schema, inner, attrs) {
        var model = this.model;
        var sel = this.createElement('div');
        if (attrs.class) sel.attr('class', attrs.class);
        if (!schema.visuals) schema.visuals = {};
        model.visual = new VisualContainer(sel.node(), schema, model.visual);
        return this.mountInner(sel, inner);
    }
});
