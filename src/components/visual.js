import assign from 'object-assign';

import {vizComponent} from './dashboard';
import Visual from '../core/visual';


//
//  Visual component
//  ======================
//
//  An element containing a visualization
export default assign({}, vizComponent, {

    build (schema) {
        var model = this.model,
            dashboard = model.dashboard,
            sel = this.createElement('div');
        // no visual group, the visual is not used in a group
        // create its own group
        if (dashboard) {
            dashboard.visuals.push(model);
        }
        // build the visual object
        schema.model = model;
        model.visual = new Visual(sel.node(), schema);
        return sel;
    },

    // once the element is mounted in the dom, draw the visual
    mounted () {
        this.model.visual.draw();
    }
});
