import {isObject} from 'd3-let';

import globalOptions from '../core/options';
import {visuals} from '../core/base';
import {vizPrototype} from '../core/chart';
import {sizeValue} from '../utils/size';


const KEYS = ['top', 'bottom', 'left', 'right'];
const LEFTRIGHT = ['left', 'right'];


// margin for visual marks
globalOptions.margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
};
// padding for the visual paper
globalOptions.padding = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
};


//
//  Bounding box for a viz
//  ==========================
vizPrototype.boundingBox = function () {
    var width = this.visual.root.width,
        height = this.visual.root.height,
        margin = calculate(this.margin, width, height),
        padding = calculate(this.padding, width, height),
        total = KEYS.reduce((o, key) => {
            o[key] = margin[key] + padding[key];
            return o;
        }, {});
    return {
        width: width,
        height: height,
        margin: margin,
        padding: margin,
        total: total,
        innerWidth: width - total.left - total.right,
        innerHeight: width - total.top - total.bottom
    };
};


visuals.events.on('after-init.margin', (viz, options) => {
    viz.margin = margins('margin', viz, options);
    viz.padding = margins('padding', viz, options);
});


function margins (name, viz, options) {
    var value = options[name],
        model;

    if (viz.visual) {
        model = viz.visual[name].$child();
    }
    else
        model = viz.model.$child(globalOptions[name]);

    if (value !== undefined && !isObject(value)) {
        var v = value || 0;
        value = {
            left: v,
            right: v,
            top: v,
            bottom: v
        };
    }

    if (value) {
        KEYS.forEach(key => {
            if (key in value) model.$set(key, value[key]);
        });
    }
    return model;
}


function calculate (model, width, height) {
    return KEYS.reduce((o, key) => {
        o[key] = sizeValue(model[key], LEFTRIGHT.indexOf(key) > -1 ? width : height);
        return o;
    }, {});
}
