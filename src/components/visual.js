import assign from 'object-assign';
import {pop} from 'd3-let';

import {vizComponent} from './dashboard';
import {visuals} from '../core/base';
import warn from '../utils/warn';


//
//  Visual component
//  ======================
//
//  An element containing a visualization
export default assign({}, vizComponent, {

    build (schema) {
        var model = this.model,
            sel = this.createElement('div'),
            type = pop(schema, 'type') || 'visual',
            Visual = visuals.types[type];
        // build the visual object
        if (Visual) {
            var visual = new Visual(sel.node(), schema, model);
            model.visualParent = visual.isViz ? visual.visualParent : visual;
        }
        else
            warn(`Unknown visual ${type}`);
        return sel;
    },

    // once the element is mounted in the dom, draw the visual
    mounted () {
        if (this.model.visualParent)
            this.model.visualParent.draw();
    }
});
