import assign from 'object-assign';
import {pop, isFunction} from 'd3-let';

import createVisual, {visuals} from './base';
import Visual from './visual';
import {applyTransforms} from '../transforms/index';

//
//  crateChart
//
//  A chart is a drawing of series data in two dimensional
export default function (type, proto) {

    return createVisual(type, assign({}, vizPrototype, chartPrototype, proto));
}


//  Viz Prototype
//  =================
export const vizPrototype = {

    initialise (element, options) {
        var visual = pop(options, 'visual');
        if (!visual) visual = new Visual(element, options);
        // get the parent model for this viz type
        var parent = visual.getVisualModel(this.type);
        // create the child model
        this.model = parent.$child(pop(options, this.type));
        this.visual = visual;
    },

    paper () {
    },

    translate (x, y) {
        if (isFunction(x)) {
            return function (d) {
                var xt = x(d) || 0,
                    yt = y(d) || 0;
                return `translate(${xt}, ${yt})`;
            };
        } else return `translate(${x}, ${y})`;
    }
};


export const chartPrototype = {

    //  override draw method
    draw () {
        visuals.events.call('before-draw', undefined, this);
        var self = this;

        this.getData().then((series) => {
            series = applyTransforms(series, self.transforms);
            this.doDraw(series);
            visuals.events.call('after-draw', undefined, this);
        });
    }
};
