import assign from 'object-assign';

import {map} from 'd3-collection';
import {axisTop, axisBottom, axisLeft, axisRight} from 'd3-axis';

import {visuals} from '../core/base';
import {vizPrototype} from '../core/chart';


const axisOrientation = map({
    top: axisTop,
    bottom: axisBottom,
    left: axisLeft,
    right: axisRight
});

const axisDefaults = {
    tickSize: 6,
    tickSizeOuter: null,
    format: null,
    stroke: '#333'
};


visuals.options.xAxis = assign({
    location: "bottom"
}, axisDefaults);


visuals.options.yAxis = assign({
    location: "left"
}, axisDefaults);


vizPrototype.xAxis = function (scale, x, y) {
    var model = this.getModel('xAxis'),
        axis = getAxis(model, scale);
    this.paper()
        .group('x-axis')
        .attr("transform", this.translate(x, y))
        .call(axis).select('path.domain').attr('stroke', model.stroke);
};

vizPrototype.yAxis = function (scale, x, y) {
    var model = this.getModel('yAxis'),
        axis = getAxis(model, scale);
    this.paper()
        .group('y-axis')
        .attr("transform", this.translate(x, y))
        .call(axis).select('path.domain').attr('stroke', model.stroke);
};


vizPrototype.axis = function (orientation, scale) {
    return axisOrientation.get(orientation)(scale);
};


function getAxis (model, scale) {
    var axis = axisOrientation.get(model.location)(scale).tickSize(model.tickSize);
    if (model.tickSizeOuter !== null) axis.tickSizeOuter(model.tickSizeOuter);
    if (model.format !== null) axis.tickFormat(model.format);
    return axis;
}
