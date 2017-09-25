import assign from 'object-assign';
import {pop} from 'd3-let';
import {dispatch} from 'd3-dispatch';
import {select} from 'd3-selection';
import {viewBase} from 'd3-view';

import globalOptions from './options';


const CONTAINERS = ['visual', 'container'];

//
//  Gloval visuals object
//  ==========================
//
//  Container of
//  * live visuals
//  * visual types
//  * paper types
//  * visual events
export const visuals = {
    live: [],
    types: {},
    papers: {},
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

    },

    // get a reactive model for type
    getModel (type) {
        var model = this.model[type];
        if (!model && type in globalOptions) {
            var options = pop(this.options, type);
            if (this.visualParent)
                model = this.visualParent.getModel(type).$child(options);
            else {
                model = this.model.$new(globalOptions[type]);
                model.$update(options);
            }
            this.model[type] = model;
        }
        return model;
    }
}, viewBase);

//
//  Create a new Visual Constructor
export default function (type, proto) {
    const opts = pop(proto, 'options');
    if (opts)
        globalOptions[type] = opts;

    function Visual(element, options, model) {
        Object.defineProperties(this, {
            visualType : {
                get () {
                    return type;
                }
            },
            isViz : {
                get () {
                    return CONTAINERS.indexOf(type) === -1;
                }
            }
        });
        this.options = options || {};
        visuals.events.call('before-init', undefined, this);
        this.initialise(element, model);
        visuals.events.call('after-init', undefined, this);
    }

    Visual.prototype = assign({}, visualPrototype, proto);
    visuals.types[type] = Visual;
    return Visual;
}
