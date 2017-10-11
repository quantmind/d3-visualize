import assign from 'object-assign';
import {isFunction} from 'd3-let';
import * as d3_scale from 'd3-scale';

import createVisual, {visuals} from './base';
import Visual from './visual';
import camelFunction from '../utils/camelfunction';
import warn from '../utils/warn';

//
//  crateChart
//
//  A chart is a drawing of series data in two dimensional
export default function (type) {
    var protos = [{}, vizPrototype, chartPrototype];
    for (var i=1; i<arguments.length; ++i) protos.push(arguments[i]);
    return createVisual(type, assign.apply(undefined, protos));
}


//  Viz Prototype
//  =================
export const vizPrototype = {

    initialise (element) {
        // No visual parent, create the visual
        var visual = this.visualParent;
        if (!visual) {
            this.visualParent = visual = new Visual(element, this.options, null, this.model);
            this.model = visual.model.$new();
            this.options = {};
        } else if (visual.visualType !== 'visual')
            throw new Error(`visual parent of ${this.visualType} can only be "visual"`);
        visual.layers.push(this);
    },

    //
    // paper object for this visualisation
    paper () {
        var visual = this.getModel('visual'),
            paper = this._paper;
        if (paper && paper.paperType === visual.render) return paper;
        var PaperType = visuals.papers[visual.render];
        if (!PaperType) throw new Error(`Unknown paper ${visual.render}`);
        paper = new PaperType(this);
        this._paper = paper;
        return paper;
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

    getScale (name) {
        return camelFunction(d3_scale, 'scale', name);
    },

    displayError () {}
};


export const chartPrototype = {

    //  override draw method
    draw () {
        if (this.drawing) {
            warn(`${this.toString()} already drawing`);
            return this.drawing;
        }
        var self = this;
        visuals.events.call('before-draw', undefined, this);
        if (this.requires) {
            //require('d3-hierarchy').then(hierarchy => {
        //        self._draw(frame, hierarchy);
        //    });
        }
        this.getData().then(frame => {
            delete self.drawing;
            if (frame) {
                this.doDraw(frame);
                visuals.events.call('after-draw', undefined, self);
            }
        }, err => {
            delete self.drawing;
            warn(`Could not draw ${self.toString()}: ${err}`);
            this.displayError(err);
        });
    }
};
