import assign from 'object-assign';
import createVisual, {visuals} from './base';
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


const chartPrototype = assign({}, vizPrototype, {

    //  override draw method
    //  invoke doDraw only if a series is available for the chart
    draw () {
        visuals.events.call('before-draw', undefined, this);
        this.applyTransforms();
        if (this.series) {
            this.doDraw();
            visuals.events.call('after-draw', undefined, this);
        }
    },

    // Apply data transforms to chart
    applyTransforms () {

    }
});
