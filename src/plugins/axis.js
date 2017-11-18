//
//  Axis Plugin
//  ================
//
//  * A visual must require "d3-axis"
//
import {timeFormat} from 'd3-time-format';
import {isDate, assign} from 'd3-let';

import {visuals} from '../core/base';
import {vizPrototype} from '../core/chart';


const axisDefaults = {
    ticks: 5,
    tickSize: 6,
    tickSizeOuter: null,
    //
    // tick labels
    rotate: null,
    ancor: 'end',
    format: null,
    timeFormat: '%Y-%m-%d',
    stroke: '#333',
    hide: null, // specify a pixel size below which tick labels are not displayed
    //
    // title
    title: null,
    titleRotate: null,
    titleOffset: 0.7
};


visuals.options.xAxis = assign({
    location: "bottom"
}, axisDefaults);


visuals.options.yAxis = assign({
    location: "left"
}, axisDefaults);


vizPrototype.getAxis = function (orientation, scale) {
    return this.getD3('axis', orientation)(scale);
};


vizPrototype.xAxis1 = function (location, scale, box, value) {
    var model = this.getModel('xAxis'),
        axis = this._axis(location, scale, model, value),
        ga = this.group('x-axis');
    this.applyTransform(ga, this.translateAxis(location, box));
    formatAxis(ga.transition(this.transition('x-axis')).call(axis), model, scale);
    if (model.title)
        this.axisTitle(ga, location, scale, box, model);
    return ga;
};


vizPrototype.yAxis1 = function (location, scale, box, value) {
    var model = this.getModel('yAxis'),
        axis = this._axis(location, scale, model, value),
        ga = this.group('y-axis');
    this.applyTransform(ga, this.translateAxis(location, box));
    formatAxis(ga.transition(this.transition('x-axis')).call(axis), model, scale);
    if (model.title)
        this.axisTitle(ga, location, scale, box, model);
    return ga;
};


//
//  Apply Axis title
vizPrototype.axisTitle = function (ga, location, scale, box, model) {
    var title = ga.selectAll('text.title').data([model.title]),
        rotate = model.titleRotate || 0,
        x = 0,
        y = 0;

    if (!rotate && (location === 'right' || location === 'left')) rotate = -90;
    if (location == "left") {
        x =-model.titleOffset*box.margin.left;
        y = box.innerHeight/2;
    }
    var translate = `translate(${x},${y}) rotate(${rotate})`,
        font = this.font(box);

    title
        .enter()
            .append('text')
            .classed('title', true)
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
        return this.translate(box.margin.left, box.margin.top);
    else if (location === 'bottom')
        return this.translate(box.margin.left, box.margin.top+box.innerHeight);
    else
        return this.translate(box.margin.left+box.innerWidth, box.margin.top);
};

vizPrototype._axis = function (location, scale, model, value) {
    var axis = this.getAxis(location, scale).tickSize(model.tickSize);
    if (model.tickSizeOuter !== null) axis.tickSizeOuter(model.tickSizeOuter);
    if (isDate(value)) axis.tickFormat(timeFormat(model.timeFormat));
    else if (model.format !== null) axis.tickFormat(this.format(model.format));
    return axis.ticks(model.ticks);
};


function formatAxis (ga, model, scale) {
    ga.select('path.domain').attr('stroke', model.stroke);
    var ticks = ga.selectAll('text').attr('fill', model.stroke);
    if (model.hide) {
        var range = scale.range(),
            dim = Math.abs(range[0] - range[range.length-1]);
        if (dim < model.hide) ga.style('opacity', 0);
        else ga.style('opacity', 1);
    }
    if (model.rotate) {
        ticks.attr('transform', `rotate(${model.rotate})`)
            .style('text-anchor', model.ancor);
    }
}
