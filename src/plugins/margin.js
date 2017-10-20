import {isObject, isArray} from 'd3-let';

import globalOptions from '../core/options';
import {visuals} from '../core/base';
import {vizPrototype} from '../core/chart';
import {sizeValue} from '../utils/size';


export const KEYS = ['top', 'bottom', 'left', 'right'];
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
vizPrototype.boundingBox = function (clearCache) {
    if (clearCache) clearBBCache(this);
    if (!this.__boundingBox) {
        var width = this.visualParent.width,
            height = this.visualParent.height,
            padding = calculate(this.getModel('padding'), width, height),
            vizWidth = width - padding.left - padding.right,
            vizHeight = height - padding.top - padding.bottom,
            margin = calculate(this.getModel('margin'), vizWidth, vizHeight),
            total = KEYS.reduce((o, key) => {
                o[key] = margin[key] + padding[key];
                return o;
            }, {});
        this.__boundingBox = {
            margin: margin,
            padding: padding,
            total: total,
            width: width,
            height: height,
            vizWidth: vizWidth,
            vizHeight: vizHeight,
            innerWidth: width - total.left - total.right,
            innerHeight: height - total.top - total.bottom,
            $nomargins: $nomargins
        };
    }
    return this.__boundingBox;
};


visuals.events.on('after-init.margin', viz => {
    viz.margin = margins('margin', viz);
    viz.padding = margins('padding', viz);
});


visuals.events.on('before-draw.margin', viz => {
    if (viz.isViz) clearBBCache(viz);
});


function margins (name, viz) {
    var value = viz.options[name];
    if (value !== undefined && !isObject(value))
        viz.options[name] = marginv(value || 0);
}


function calculate (model, width, height) {
    return KEYS.reduce((o, key) => {
        o[key] = sizeValue(model[key], LEFTRIGHT.indexOf(key) > -1 ? width : height);
        return o;
    }, {});
}


function clearBBCache (viz) {
    delete viz.__boundingBox;
    if (isArray(viz.layers)) viz.layers.forEach(clearBBCache);
}


function $nomargins () {
    return {
        width: this.innerWidth,
        height: this.innerHeight,
        margin: marginv(0),
        padding: marginv(0),
        total: marginv(0),
        innerWidth: this.innerWidth,
        innerHeight: this.innerHeight,
        $nomargins: this.$nomargins
    };
}


function marginv (v) {
    return {
        left: v,
        right: v,
        top: v,
        bottom: v
    };
}
