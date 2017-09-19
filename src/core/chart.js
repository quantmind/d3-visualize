import assign from 'object-assign';
import createVisual, {visualEvents} from './base';
import Visual from './visual';

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


const chartPrototype = assign({}, {

    //  override draw method
    //  invoke doDraw only if a series is available for the chart
    draw () {
        visualEvents.call('before-draw', this);
        this.applyTransforms();
        if (this.series) {
            this.doDraw();
            visualEvents.call('after-draw', this);
        }
    },

    // Apply data transforms to chart
    applyTransforms () {

    }
}, vizPrototype);
