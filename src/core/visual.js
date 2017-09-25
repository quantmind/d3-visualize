import {pop} from 'd3-let';
import {viewModel} from 'd3-view';
import {select} from 'd3-selection';

import createVisual, {RootElement, visuals} from './base';
import globalOptions from './options';
import warn from '../utils/warn';

//
//  Visual
//  =============
//
//  A Visual is a a container of visual layers and it is
//  associated with an HTML element
//
//  Usually a Visual contains one layer only, however it is possible to
//  have more than one by combining several layers together. Importantly,
//  layers in one visual generate HTMLElements which are children of the visual
//  element and inherit both the width and height.
//
//  A visual register itself with the visuals.live array
//
export default createVisual('visual', {

    options: {
        render: 'svg'
    },

    initialise (element, options) {
        if (!element) throw new Error('HTMLElement required by visual group');
        var root = new RootElement(element, options);
        this.select(element).classed('d3-visual', true);
        // list of layers which define the visual
        this.visuals = [];
        this.options = options;
        this.model = pop(options, 'model');
        this.drawCount = 0;
        visuals.live.push(this);

        if (!this.model) this.model = viewModel();
        //
        // set global options  without rewriting
        this.model.$update(globalOptions[this.visualType], false);
        // update model from options
        this.model.$update(pop(options, this.visualType));

        Object.defineProperties(this, {
            element : {
                get () {
                    return element;
                }
            },
            sel: {
                get () {
                    return select(element);
                }
            },
            root : {
                get () {
                    return root;
                }
            }
        });
    },

    // Draw the visual
    draw() {
        if (!this.drawCount) {
            this.drawCount = 1;
            this.root.fit();
        } else {
            this.drawCount++;
            this.clear();
        }
        visuals.events.call('before-draw', undefined, this);
        this.visuals.forEach(visual => {
            visual.draw();
        });
        visuals.events.call('after-draw', undefined, this);
    },

    clear () {},

    // Add a new visual to this group
    addVisual (options) {
        options.visual = this;
        var VisualClass = visuals.types[options.type];
        if (!VisualClass)
            warn(`Cannot add visual ${options.type}`);
        else {
            var viz = new VisualClass(this.element, options);
            this.visuals.push(viz);
            return viz;
        }
    },

    getVisualModel (type) {
        var model = this.model[type];
        if (!model) {
            model = this.model.$new(globalOptions[type]);
            model.$update(pop(this.options, type));
            this.model[type] = model;
        }
        return model;
    },
    //
    // Resize the visual group if it needs resizing
    //
    resize (size) {
        this.root.resize(this, size);
    },

    destroy () {
        var idx = visuals.live.indexOf(this);
        if (idx > -1) {
            visuals.live.splice(idx, 1);
            this.visuals.forEach(visual => visual.destroy());
        }
    }
});
