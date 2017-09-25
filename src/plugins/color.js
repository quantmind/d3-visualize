import globalOptions from '../core/options';
import {visuals} from '../core/base';
import {vizPrototype} from '../core/chart';


globalOptions.colorScale = 'cool';


visuals.events.on('after-init.color', (viz, options) => {
    if (viz.visual) {
        if (options.colorScale) viz.model.$set('colorScale', colorScale);
    }
    else {
        var colorScale = options.colorScale || globalOptions.colorScale;
        viz.model.$set('colorScale', colorScale);
    }
});


//
//  Color scale method
//  ==========================
vizPrototype.colorScale = function () {
};
