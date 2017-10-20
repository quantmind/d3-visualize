import {legendColor, legendSize, legendSymbol} from 'd3-svg-legend';
import {map} from 'd3-collection';
import {pop} from 'd3-let';

import globalOptions from '../core/options';
import {vizPrototype} from '../core/chart';
import warn from '../utils/warn';


globalOptions.legend = {
    location: "top-right",
    orient: "vertical",
    fontSize: '3%',
    title: '',
    titleWidth: "20%",
    labelFormat: null,
    titleMinWidth: 30,
    titleMaxWidth: 60,
    minFontSize: 10,
    maxFontSize: 20,
    offset: [10, 10],
    shapeWidth: 15,
    shapeHeight: 15,
    hide: 300, // specify a pixel size below which tick labels are not displayed
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
        model = this.getModel('legend'),
        font = this.getModel('font'),
        name = pop(cfg, 'type') || vizModel.legendType,
        vizSize = Math.max(box.vizHeight, box.vizWidth),
        fontSize = this.dim(model.fontSize, vizSize, model.minFontSize, model.maxFontSize),
        legend = legends[name];

    if (!model.location) return;

    if (!legend) return warn(`Could not load legend ${name}`);
    legend = legend().orient(model.orient);

    if (model.title) {
        legend.title(model.title);
        if (model.titleWidth) {
            var width = this.dim(model.titleWidth, vizSize, model.titleMinWidth, model.titleMaxWidth);
            legend.titleWidth(width);
        }
    }

    if (model.labelFormat) legend.labelFormat(model.labelFormat);
    legend.shapeWidth(model.shapeWidth).shapeHeight(model.shapeHeight);

    // apply cfg parameters
    for (let key in cfg) legend[key](cfg[key]);

    var gl = this.group('legend')
            .style('font-size', `${fontSize}px`)
            .html('')
            .call(legend),
        bb = gl.node().getBBox(),
        offset = locations.get(model.location).call(this, bb, box, model),
        transform = this.translate(offset.x, offset.y);
    gl.selectAll('text').style('fill', model.stroke || font.stroke);
    this.applyTransform(gl, transform);
    //
    //
    // if the legend needs to be hidden below a certain size
    if (model.hide) {
        if (vizSize < model.hide) gl.style('opacity', 0);
        else gl.style('opacity', 1);
    }
};


export const locations = map({
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
    var offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: box.margin.left + (box.innerWidth - bb.width)/2,
        y: offsetY
    };
}


function bottom (bb, box, options) {
    var offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: box.margin.left + (box.innerWidth - bb.width)/2,
        y: box.vizHeight - bb.height - offsetY
    };
}


function right (bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth);
    return {
        x: box.vizWidth - bb.width - offsetX,
        y: box.margin.top + (box.innerHeight - bb.height)/2
    };
}


function left (bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth);
    return {
        x: box.margin.left - offsetX,
        y: box.margin.top + (box.innerHeight - bb.height)/2
    };
}


function topLeft (bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth),
        offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: box.margin.left + (box.innerWidth - bb.width)/2 + offsetX,
        y: offsetY
    };
}


function topRight (bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth),
        offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: box.vizWidth - bb.width - offsetX,
        y: offsetY
    };
}


function bottomLeft (bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth),
        offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: bb.width + offsetX,
        y: box.vizHeight - bb.height - offsetY
    };
}


function bottomRight (bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth),
        offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: box.vizWidth - bb.width - offsetX,
        y: box.vizHeight - bb.height - offsetY
    };
}
