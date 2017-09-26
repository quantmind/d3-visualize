import assign from 'object-assign';
import {isFunction} from 'd3-let';

import createVisual, {visuals} from './base';
import Visual from './visual';
import {applyTransforms} from '../transforms/index';

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

    initialise (element, model) {
        var visual = model ? model.visualParent : null;
        if (!visual || visual.visualType !== 'visual') {
            visual = new Visual(element, this.options, model);
            this.options = {};
        }
        this.visualParent = visual;
        this.model = visual.model.$new();
        visual.layers.push(this);
    },

    //
    // paper object for this visualisation
    paper () {
        var visual = this.getModel('visual'),
            paper = this._paper;
        if (paper && paper.type === visual.render) return paper;
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
    }
};


export const chartPrototype = {

    //  override draw method
    draw () {
        visuals.events.call('before-draw', undefined, this);
        var self = this;

        this.getData().then(frame => {
            if (frame) {
                frame = applyTransforms(frame, self.transforms);
                this.doDraw(frame);
                visuals.events.call('after-draw', undefined, this);
            }
        });
    }
};
