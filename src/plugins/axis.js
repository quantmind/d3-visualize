import assign from 'object-assign';

import {map} from 'd3-collection';
import {format} from 'd3-format';
import {timeFormat} from 'd3-time-format';
import {axisTop, axisBottom, axisLeft, axisRight} from 'd3-axis';
import {isDate} from 'd3-let';

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
    timeFormat: '%Y-%m-%d',
    stroke: '#333',
    // title
    title: null,
    titleRotate: null,
    titleShift: 2/3
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


vizPrototype.xAxis1 = function (location, scale, box, value) {
    var model = this.getModel('xAxis'),
        axis = getAxis(location, scale, model, value);
    this.paper()
        .group('x-axis')
        .attr("transform", this.translateAxis(location, box))
        .transition()
        .call(axis).select('path.domain').attr('stroke', model.stroke);
    if (model.title)
        this.axisTitle(location, scale, box, model);
};


vizPrototype.yAxis1 = function (location, scale, box, value) {
    var model = this.getModel('yAxis'),
        axis = getAxis(location, scale, model, value);
    this.paper()
        .group('y-axis')
        .attr("transform", this.translateAxis(location, box))
        .transition()
        .call(axis).select('path.domain').attr('stroke', model.stroke);
    if (model.title)
        this.axisTitle(location, scale, box, model);
};


vizPrototype.axis = function (orientation, scale) {
    return axisOrientation.get(orientation)(scale);
};


//
//  Apply Axis title
vizPrototype.axisTitle = function (location, scale, box, model) {
    var rotate = model.titleRotate || 0, x = 0, y = 0,
        title = this.group('axis-'+location+'-title')
                    .attr("transform", this.translateAxis(location, box))
                    .selectAll('text')
                    .data([model.title]);
    if (!rotate && (location === 'right' || location === 'left')) rotate = -90;
    if (location == "left") {
        x =-model.titleShift*box.margin.left;
        y = box.innerHeight/2;
    }
    var translate = `translate(${x},${y}) rotate(${rotate})`,
        font = this.font(box);

    title
        .enter()
            .append('text')
            .attr("transform", translate)
            .style("text-anchor", "middle")
            .style("font-size", font)
            .style("fill", model.stroke)
            .text(d => d)
        .merge(title)
            .transition()
            .attr("transform", translate)
            .style("font-size", font)
            .style("fill", model.stroke)
            .text(d => d);
};

vizPrototype.translateAxis = function (location, box) {
    if (location === 'top' || location === 'left')
        return this.translate(box.total.left, box.total.top);
    else if (location === 'bottom')
        return this.translate(box.total.left, box.total.top+box.innerHeight);
    else
        return this.translate(box.total.left+box.innerWidth, box.total.top);
};

function getAxis (location, scale, model, value) {
    var axis = axisOrientation.get(location)(scale).tickSize(model.tickSize);
    if (model.tickSizeOuter !== null) axis.tickSizeOuter(model.tickSizeOuter);
    if (isDate(value)) axis.tickFormat(timeFormat(model.timeFormat));
    else if (model.format !== null) axis.tickFormat(format(model.format));
    return axis.ticks(model.ticks);
}
