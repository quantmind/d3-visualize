import {pop, isString, isObject, assign} from 'd3-let';
import {dispatch} from 'd3-dispatch';
import {viewBase, viewModel} from 'd3-view';
import 'd3-transition';

import globalOptions from './options';
import {sizeValue} from '../utils/size';
import minmax from '../utils/minmax';
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
    schema: {
        title: "Visualize Specification Language",
        type: "object",
        definitions: {
            size: {
                oneOf: [
                    {
                        type: "number",
                        description: "size in pixels",
                        minimum: 0
                    },
                    {
                        type: "string",
                        description: "Size as a percentage"
                    }
                ]
            }
        }
    },
    events: dispatch(
        'before-init',
        'after-init',
        'resize',
        'before-draw',
        'after-draw'
    )
};

function defaultsFromProperties (properties) {
    var options = {};
    let value, prop, key;
    for (key in properties) {
        prop = properties[key];
        if (prop['$ref']) prop = schemaDef(prop['$ref']);
        value = properties[key].default;
        options[key] = value === undefined ? null : value;
    }
    return options;
}


function schemaDef (d) {
    var dd = d.split('/');
    return visuals.schema.definitions[dd[dd.length-1]] || {};
}

//
//  Visual Interface
//  ====================
//
//  Base prototype object for visuals
//
export const visualPrototype = {

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

    // apply the visualmodel uid to a name
    idname (name) {
        if (!name) name = this.visualType;
        return `${name}-${this.model.uid}`;
    },

    modelProperty (name, model) {
        var me = this.getModel(),
            value = me[name];
        return value === undefined ? model[name] : value;
    },

    dim (size, refSize, minSize, maxSize) {
        return minmax(sizeValue(size, refSize), minSize, maxSize);
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
};

//
//  Create a new Visual Constructor
export default function (type, proto) {
    const schema = pop(proto, 'schema');
    if (schema) {
        visuals.options[type] = defaultsFromProperties(schema);
        visuals.schema.definitions[type] = {
            type: "object",
            properties: assign({
                data: {
                    "$ref": "#/definitions/data"
                }
            }, schema)
        };
    }

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

    Visual.prototype = assign({}, viewBase, visualPrototype, proto);
    Visual.prototype.constructor = Visual;
    visuals.types[type] = Visual;
    return Visual;
}
