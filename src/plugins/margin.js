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
    var width = this.visualParent.width,
        height = this.visualParent.height,
        margin = calculate(this.getModel('margin'), width, height),
        padding = calculate(this.getModel('padding'), width, height),
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
        innerHeight: height - total.top - total.bottom
    };
};


visuals.events.on('after-init.margin', viz => {
    viz.margin = margins('margin', viz);
    viz.padding = margins('padding', viz);
});


function margins (name, viz) {
    var value = viz.options[name];

    if (value !== undefined && !isObject(value)) {
        var v = value || 0;
        viz.options[name] = {
            left: v,
            right: v,
            top: v,
            bottom: v
        };
    }
}


function calculate (model, width, height) {
    return KEYS.reduce((o, key) => {
        o[key] = sizeValue(model[key], LEFTRIGHT.indexOf(key) > -1 ? width : height);
        return o;
    }, {});
}
