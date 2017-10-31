import assign from 'object-assign';
import {isFunction, isArray, isString, pop} from 'd3-let';
import {require, viewProviders} from 'd3-view';
import * as d3_scale from 'd3-scale';

import createVisual, {visuals} from './base';
import Visual from './visual';
import camelFunction from '../utils/camelfunction';
import extendObject from '../utils/extend-object';
import warn from '../utils/warn';


//
//  crateChart
//
//  A chart is a drawing of series data in two dimensional
export default function (type) {
    if (viewProviders.visualPlugins) {
        extendVisualPrototype(viewProviders.visualPlugins);
        viewProviders.visualPlugins = null;
    }
    var protos = [{}, vizPrototype, chartPrototype];
    for (var i=1; i<arguments.length; ++i) protos.push(arguments[i]);
    return createVisual(type, assign.apply(undefined, protos));
}


function extendVisualPrototype (plugins) {
    let options, proto;
    Object.keys(plugins).forEach(name => {
        options = plugins[name].options;
        proto = plugins[name].prototype;
        if (options) visuals.options[name] = options;
        if (proto) assign(vizPrototype, proto);
    });
}

//  Viz Prototype
//  =================
export const vizPrototype = {

    initialise (element) {
        // No visual parent, create the visual
        var visual = this.visualParent;
        if (this.options.active !== undefined)
            this.active = pop(this.options, 'active');
        else
            this.active = true;
        if (!visual) {
            this.visualParent = visual = new Visual(element, this.options, null, this.model);
            this.model = visual.model.$new();
            this.options = {};
        } else if (!visual.layers)
            throw new Error(`visual parent of ${this.visualType} does not have layers`);
        visual.layers.push(this);
    },

    //
    // paper object for this visualisation
    paper () {
        return this.visualParent.paper();
    },

    activate (callback) {
        if (!this.active) {
            this.active = true;
            this.group()
                .transition(this.model.uid)
                .on('end', () => {
                    if(callback) callback();
                })
                .style('opacity', 1);
        }
        return this;
    },

    deactivate (callback) {
        if (this.active) {
            this.active = false;
            this.group()
                .transition(this.model.uid)
                .on('end', () => {
                    if(callback) callback();
                })
                .style('opacity', 0);
        }
        return this;
    },

    getVisual () {
        return this.visualParent.getVisual();
    },

    // a group selection for a given name
    group (name) {
        var me = `${this.visualType}-${this.model.uid}`,
            group = this.visualParent.getPaperGroup(me);
        if (name && name !== this.visualType) return this.paper().childGroup(group, name);
        else return group;
    },

    translate (x, y) {
        if (isFunction(x)) {
            return function (d) {
                var xt = x(d) || 0,
                    yt = y(d) || 0;
                return `translate(${xt}, ${yt})`;
            };
        } else return `translate(${x}, ${y})`;
    },

    getScale (cfg) {
        if (isString(cfg)) cfg = {type: cfg};
        return extendObject(camelFunction(d3_scale, 'scale', cfg.type), cfg);
    },

    displayError () {}
};


export const chartPrototype = {

    //  override draw method
    draw (fetchData) {
        if (this.drawing) {
            warn(`${this.toString()} already drawing`);
            return this.drawing;
        }
        var self = this,
            doDraw = this.doDraw;

        this.paper().size(this.boundingBox(true));

        if(!this.active) return;

        visuals.events.call('before-draw', undefined, this);

        if (fetchData === false && this._drawArgs) {
            delete self.drawing;
            doDraw.apply(self, this._drawArgs);
            visuals.events.call('after-draw', undefined, self);
        } else {
            return Promise.all([
                this.requires ? require.apply(undefined, this.requires) : [],
                // this.getMetaData(),
                this.getData()
            ]).then(args => {
                delete self.drawing;
                var frame = args[1];
                if (frame) {
                    args = isArray(args[0]) ? args[0] : [args[0]];
                    args.unshift(frame);
                    this._drawArgs = args;
                    doDraw.apply(self, args);
                    visuals.events.call('after-draw', undefined, self);
                }
            }, err => {
                delete self.drawing;
                warn(`Could not draw ${self.toString()}: ${err}`, err);
                this.displayError(err);
            });
        }
    }
};
