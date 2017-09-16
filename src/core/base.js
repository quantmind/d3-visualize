import assign from 'object-assign';
import {dispatch} from 'd3-dispatch';
import {select} from 'd3-canvas-transition';
import {viewBase} from 'd3-view';

import globalOptions from './options';
import {getSize, boundingBox} from '../utils/size';


export const liveVisuals = [];
export const visualTypes = {};
export const visualEvents = dispatch('init', 'before-draw', 'after-draw');

//
//  Visual Interface
//  ====================
//
//  Base prototype object for visuals
//
const visualPrototype = assign({}, {

    // initialise the visual with options
    initialise () {

    },

    // draw this visual
    draw () {

    },

    select (el) {
        return select(el);
    },

    // destroy the visual
    destroy () {

    }
}, viewBase);


//
//  Root element
//  ================
//
//  Controls the size of a a visual or visuals within a group
//  It does not control margins
export function RootElement (element, options) {

    Object.defineProperties(this, {
        element: {
            get () {
                return element;
            }
        },
        sel: {
            get () {
                return select(element);
            }
        },
        size: {
            get () {
                return [this.width, this.height];
            }
        }
    });
    this.width = options.width;
    this.height = options.height;
    this.sel.classed('d3-visual-root', true);
}


RootElement.prototype = {
    select (el) {
        return select(el);
    },

    // Fit the root element to the size of the parent element
    fit () {
        var size = getSize(this.element, this);
        this.width = size.width;
        this.height = size.height;
    },

    resize (visual, size) {
        if (!size) size = boundingBox(this);
        var currentSize = this.size;

        if (currentSize[0] !== size[0] || currentSize[1] !== size[1]) {
            this.root.width = size[0];
            this.root.height = size[1];
            visualEvents.call('before-draw', visual);
            visual.draw();
            visualEvents.call('after-draw', visual);
        }
    }
};

//
//  Create a new Visual Constructor
export default function (type, proto) {

    function Visual(element, options) {
        options = assign({}, globalOptions[type], options);

        Object.defineProperties(this, {
            visualType : {
                get () {
                    return type;
                }
            },
            element: {
                get: function () {
                    return element;
                }
            }
        });
        this.initialise(element, options);
        visualEvents.call('init', this, options);
    }

    Visual.prototype = assign({}, visualPrototype, proto);
    visualTypes[type] = Visual;
    return Visual;
}
