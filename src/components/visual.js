import assign from 'object-assign';
import {pop} from 'd3-let';

import {vizComponent} from './dashboard';
import Visual from '../core/visual';


//
//  Visual component
//  ======================
//
//  An element containing a visualization
export default assign({}, vizComponent, {

    build (schema, inner, attrs) {
        var sel = this.createElement('div'),
            type = schema.type || 'visual',
            model = this.model,
            visualDrawOnMount = pop(schema, 'visualDrawOnMount'),
            options = {},
            layers;

        if (attrs.class) sel.attr('class', attrs.class);

        if (type === 'visual') {
            layers = pop(schema, 'layers');
            options = schema;
        }
        else
            options.visual = pop(schema, 'visual') || {};

        if (visualDrawOnMount !== undefined) model.visualDrawOnMount = visualDrawOnMount;
        model.visual = new Visual(sel.node(), options, model.visual, model.visual ? null : model.$new());
        if (type !== 'visual') model.visual.addVisual(schema);
        else if (layers) {
            layers.forEach(layer => model.visual.addVisual(layer));
        }
        return sel;
    },

    // once the element is mounted in the dom, draw the visual
    mounted () {
        if (this.model.visualDrawOnMount === false) return;
        this.model.visual.redraw();
    }
});
