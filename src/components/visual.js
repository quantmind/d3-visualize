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
        var sel = this.createElement('div'),
            type = schema.type || 'visual',
            model = this.model,
            options = type === 'visual' ? schema : {};

        model.visual = new Visual(sel.node(), options, model.visual);
        if (type !== 'visual') model.visual.addVisual(schema);
        return sel;
    },

    // once the element is mounted in the dom, draw the visual
    mounted () {
        this.model.visual.draw();
    }
});
