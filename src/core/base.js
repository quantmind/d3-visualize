import assign from 'object-assign';
import {pop, isString, isObject} from 'd3-let';
import {dispatch} from 'd3-dispatch';
import {select} from 'd3-selection';
import {viewBase, viewModel} from 'd3-view';
import 'd3-transition';

import globalOptions from './options';
import {sizeValue} from '../utils/size';
import clone from '../utils/clone';


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
    options: globalOptions,
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
export const visualPrototype = assign({}, {

    // initialise the visual with options
    initialise () {

    },

    // draw this visual
    draw () {},

    // redraw the visual
    // this is the method that should be invoked by applications
    redraw (fetchData) {
        if (this.drawing) {
            var self = this,
                event = `after-draw.${this.toString()}`;
            visuals.events.on(event, () => {
                // remove callback
                visuals.events.on(event, null);
                self.redraw(fetchData);
            });
        } else
            this.drawing = this.draw(fetchData);
        return this.drawing;
    },

    select (el) {
        return select(el);
    },

    // destroy the visual
    destroy () {},

    toString () {
        return `${this.visualType}-${this.model.uid}`;
    },

    // get a reactive model for type
    getModel (type) {
        if (!type) type = this.visualType;
        var model = this.model[type];
        if (!model && type in globalOptions) {
            var options = pop(this.options, type),
                self = this;
            if (this.visualParent)
                model = this.visualParent.getModel(type).$child(options);
            else {
                model = this.model.$new(globalOptions[type]);
                model.$update(options);
            }
            this.model[type] = model;
            //
            // Trigger redraw when model change
            // Do not fecth data
            model.$on(() => self.redraw(false));
        }
        return model;
    },

    dim (size, refSize, minSize, maxSize) {
        size = Math.max(sizeValue(size, refSize), minSize || 0);
        if (maxSize) {
            maxSize = Math.max(maxSize, minSize || 0);
            size = Math.min(size, maxSize);
        }
        return size;
    },
    // pop this visual from a container
    pop (container) {
        if (container) {
            var idx = container.live.indexOf(this);
            if (idx > -1) container.live.splice(idx, 1);
        }
    },

    getVisualSchema (name) {
        var schema = this.options.visuals ? this.options.visuals[name] : null,
            parent = this.visualParent;
        if (parent && isString(schema)) {
            name = schema;
            schema = parent.getVisualSchema(name);
        } else if (parent && !schema)
            schema = parent.getVisualSchema(name);
        if (isObject(schema))
            return clone(schema);
    }
}, viewBase);

//
//  Create a new Visual Constructor
export default function (type, proto) {
    const opts = pop(proto, 'options');
    if (opts)
        globalOptions[type] = opts;

    function Visual(element, options, parent, model) {
        Object.defineProperties(this, {
            visualType: {
                get () {
                    return type;
                }
            },
            isViz: {
                get () {
                    return CONTAINERS.indexOf(type) === -1;
                }
            },
            visualRoot: {
                get () {
                    if (this.visualParent) return this.visualParent.visualRoot;
                    return this;
                }
            }
        });
        this.visualParent = parent;
        this.model = parent ? parent.model.$new() : (model || viewModel());
        this.options = options || {};
        this.drawing = false;
        visuals.events.call('before-init', undefined, this);
        this.initialise(element);
        visuals.events.call('after-init', undefined, this);
    }

    Visual.prototype = assign({}, visualPrototype, proto);
    visuals.types[type] = Visual;
    return Visual;
}
