import {legendColor, legendSize, legendSymbol} from 'd3-svg-legend';
import {map} from 'd3-collection';

import globalOptions from '../core/options';
import {vizPrototype} from '../core/chart';
import warn from '../utils/warn';


globalOptions.legend = {
    location: "top-right",
    orient: "vertical",
    fontSize: '3%',
    title: '',
    titleWidth: "20%",
    titleMinWidth: 30,
    titleMaxWidth: 60,
    minFontSize: 10,
    maxFontSize: 20,
    offsetX: 10,
    offsetY: 10
};


const legends = {
    color: legendColor,
    size: legendSize,
    symbol: legendSymbol
};


//
//  Legend method
//  ==========================
vizPrototype.legend = function (cfg, box) {
    var vizModel = this.getModel(),
        lgModel = this.getModel('legend'),
        name = vizModel.legendType,
        size = this.dim(lgModel.fontSize, box.height, lgModel.minFontSize, lgModel.maxFontSize);
    if (!name) return;
    var legend = legends[name];
    if (!legend) return warn(`Could not load legend ${name}`);
    legend = legend().orient(lgModel.orient);
    if (lgModel.title) {
        var width = this.dim(lgModel.titleWidth, box.width, lgModel.titleMinWidth, lgModel.titleMaxWidth);
        legend.title(lgModel.title).titleWidth(width);
    }
    for (let key in cfg) legend[key](cfg[key]);
    var g = this.paper()
            .group('legend')
            .style('font-size', `${size}px`)
            .call(legend),
        bb = locations.get(lgModel.location)(g.node().getBBox(), box, lgModel);
    g.attr('transform', this.translate(bb.x, bb.y));
};


const locations = map({
    top,
    bottom,
    right,
    left,
    'top-left': topLeft,
    'top-right': topRight,
    'bottom-left': bottomLeft,
    'bottom-right': bottomRight
});


function top (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: options.offsetY
    };
}


function bottom (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: box.height - bb.height - options.offsetY
    };
}


function right (bb, box, options) {
    return {
        x: box.width - bb.width - options.offsetX,
        y: options.offsetY
    };
}


function left (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: options.offsetY
    };
}


function topLeft (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: options.offsetY
    };
}


function topRight (bb, box, options) {
    return {
        x: box.width - bb.width - options.offsetX,
        y: options.offsetY
    };
}


function bottomLeft (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: box.height - bb.height - options.offsetY
    };
}


function bottomRight (bb, box, options) {
    return {
        x: box.width - bb.width - options.offsetX,
        y: box.height - bb.height - options.offsetY
    };
}
