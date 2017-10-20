import assign from 'object-assign';

import {isArray, pop} from 'd3-let';
import {set} from 'd3-collection';

import createVisual, {visuals} from '../core/base';
import {vizPrototype, chartPrototype} from '../core/chart';
import warn from '../utils/warn';


export default function (type) {
    var protos = [{}, vizPrototype, chartPrototype, compositePrototype];
    for (var i=1; i<arguments.length; ++i) protos.push(arguments[i]);
    return createVisual(type, assign.apply(undefined, protos));
}


const compositePrototype = {

    initialise (element) {
        vizPrototype.initialise.call(this, element);
        let options = this.getLayers();
        if (!isArray(options) || !options.length) {
            warn('a composite chart requires layers');
            options = [];
        }

        // visual-alike API
        Object.defineProperties(this, {
            element : {
                get () {
                    return this.visualParent.element;
                }
            },
            paperElement : {
                get () {
                    return this.visualParent.paperElement;
                }
            },
            sel: {
                get () {
                    return this.visualParent.sel;
                }
            },
            width: {
                get () {
                    return this.boundingBox().innerWidth;
                }
            },
            height: {
                get () {
                    return this.boundingBox().innerHeight;
                }
            }
        });


        var self = this,
            requires = set();
        let viz, type, VisualClass;

        this.layers = [];
        options.forEach(layer => {
            layer = assign({}, layer);
            type = pop(layer, 'type');
            VisualClass = visuals.types[type];
            if (!VisualClass)
                warn(`Cannot add visual type "${type}", not available`);
            else {
                layer[type] = assign({}, layer[type], self.options[type]);
                viz = new VisualClass(self.element, layer, self);
                if (viz.requires) viz.requires.forEach(r => requires.add(r));
            }
        });
        this.requires = requires.values();
        if (!this.requires.length) delete this.requires;
    },

    getLayers () {

    },

    layerOptions (layer) {
        return assign(layer, this.options);
    },

    getPaperGroup (cname) {
        var box = this.boundingBox(),
            layers = this.group('layers');
        this.applyTransform(layers, this.translate(box.margin.left, box.margin.top));
        return this.paper().childGroup(layers, cname);
    },

    doDraw (frame, mod) {
        var box = this.boundingBox();
        this.applyTransform(this.group(), this.translate(box.padding.left, box.padding.top));
        this.layers.forEach(viz => viz.doDraw(frame, mod));
    }
};
