import assign from 'object-assign';

import createVisual, {visuals} from './base';
import Visual from './visual';
import {applyTransforms} from '../transforms/index';

//
//  crateChart
//
//  A chart is a drawing of series data in two dimensional
export default function (type, proto) {

    return createVisual(type, assign({}, chartPrototype, proto));
}


export const vizPrototype = {

    initialise (element, options) {
        if (!options.visual)
            options.visual = new Visual(element, options);
        this.visual = options.visual;
    }
};


const chartPrototype = assign({}, vizPrototype, {

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
});
