import assign from 'object-assign';
import {pop} from 'd3-let';
import {dispatch} from 'd3-dispatch';
import {select} from 'd3-selection';
import {viewBase} from 'd3-view';

import globalOptions from './options';
import {getSize, boundingBox} from '../utils/size';


export const visuals = {
    live: [],
    types: {},
    events: dispatch(
        'before-init',
        'after-init',
        'before-draw',
        'after-draw'
    )
};

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
    draw () {},

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
    this.options = assign({}, globalOptions.size, options.size);

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
}


RootElement.prototype = {
    select (el) {
        return select(el);
    },

    // Fit the root element to the size of the parent element
    fit () {
        var size = getSize(this.element.parentNode, this.options);
        this.width = size.width;
        this.height = size.height;
        this.sel.style('width', this.width + 'px').style('height', this.height + 'px');
    },

    resize (visual, size) {
        if (!size) size = boundingBox(this);
        var currentSize = this.size;

        if (currentSize[0] !== size[0] || currentSize[1] !== size[1]) {
            this.width = size[0];
            this.height = size[1];
            visual.draw();
        }
    }
};

//
//  Create a new Visual Constructor
export default function (type, proto) {
    const opts = pop(proto, 'options');
    if (opts)
        globalOptions[type] = opts;

    function Visual(element, options) {
        options = assign({}, globalOptions[type], options);
        visuals.events.call('before-init', undefined, this, options);
        element = this.initialise(element, options);

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
        visuals.events.call('after-init', undefined, this, options);
    }

    Visual.prototype = assign({}, visualPrototype, proto);
    visuals.types[type] = Visual;
    return Visual;
}
