import assign from 'object-assign';

import {map} from 'd3-collection';
import {format} from 'd3-format';
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
    ticks: 5,
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
        axis = getAxis(model.location, scale, model);
    this.paper()
        .group('x-axis')
        .attr("transform", this.translate(x, y))
        .transition()
        .call(axis).select('path.domain').attr('stroke', model.stroke);
};

vizPrototype.yAxis = function (scale, x, y) {
    var model = this.getModel('yAxis'),
        axis = getAxis(model.location, scale, model);
    this.paper()
        .group('y-axis')
        .attr("transform", this.translate(x, y))
        .transition()
        .call(axis).select('path.domain').attr('stroke', model.stroke);
};


vizPrototype.xAxis1 = function (location, scale, box) {
    var model = this.getModel('xAxis'),
        axis = getAxis(location, scale, model);
    this.paper()
        .group('x-axis')
        .attr("transform", this.translateAxis(location, box))
        .transition()
        .call(axis).select('path.domain').attr('stroke', model.stroke);
};


vizPrototype.yAxis1 = function (location, scale, box) {
    var model = this.getModel('yAxis'),
        axis = getAxis(location, scale, model);
    this.paper()
        .group('y-axis')
        .attr("transform", this.translateAxis(location, box))
        .transition()
        .call(axis).select('path.domain').attr('stroke', model.stroke);
};


vizPrototype.axis = function (orientation, scale) {
    return axisOrientation.get(orientation)(scale);
};


vizPrototype.translateAxis = function (location, box) {
    if (location === 'top' || location === 'left')
        return this.translate(box.total.left, box.total.top);
    else if (location === 'bottom')
        return this.translate(box.total.left, box.total.top+box.innerHeight);
    else
        return this.translate(box.total.left+box.innerWidth, box.total.top);
};

function getAxis (location, scale, model) {
    var axis = axisOrientation.get(location)(scale).tickSize(model.tickSize);
    if (model.tickSizeOuter !== null) axis.tickSizeOuter(model.tickSizeOuter);
    if (model.format !== null) axis.tickFormat(format(model.format));
    return axis.ticks(model.ticks);
}
