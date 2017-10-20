import {
    line,
    curveBasisClosed,
    curveBasisOpen,
    curveBasis,
    curveBundle,
    curveCardinalClosed,
    curveCardinalOpen,
    curveCardinal,
    curveCatmullRomClosed,
    curveCatmullRomOpen,
    curveCatmullRom,
    curveLinearClosed,
    curveLinear,
    curveMonotoneX,
    curveMonotoneY,
    curveNatural
} from 'd3-shape';

import {isFunction} from 'd3-let';
import {extent} from 'd3-array';

import createChart from '../core/chart';
import warn from '../utils/warn';
import camelFunction from '../utils/camelfunction';
import grouper from '../transforms/groups';


export const curves = {
    curveBasisClosed,
    curveBasisOpen,
    curveBasis,
    curveBundle,
    curveCardinalClosed,
    curveCardinalOpen,
    curveCardinal,
    curveCatmullRomClosed,
    curveCatmullRomOpen,
    curveCatmullRom,
    curveLinearClosed,
    curveLinear,
    curveMonotoneX,
    curveMonotoneY,
    curveNatural
};

export const lineDrawing = {

    curve (name) {
        var obj = camelFunction(curves, 'curve', name, true);
        if (!obj) {
            warn(`Could not locate curve type "${name}"`);
            obj = curveNatural;
        }
        return obj;
    },

    range (data, x, y, agg) {
        var range = {
            x: extent(data, x),
            y: extent(data, y)
        };
        if (agg) {
            Array.prototype.push.apply(agg.x, range.x);
            Array.prototype.push.apply(agg.y, range.y);
        }
    },

    newRange () {
        return {
            x: [],
            y: []
        };
    },

    x (box, ranges) {
        var model = this.getModel(),
            scale = this.getScale(model.scaleX)
                .domain(extent(ranges))
                .range([0, box.innerWidth]);
        return function (d) {
            return scale(d[model.x]);
        };
    },

    y (box, ranges, value) {
        var model = this.getModel(),
            scale = this.getScale(model.scaleY)
                .domain(extent(ranges))
                .range([box.innerHeight, 0]);
        if (arguments.length === 2) value = d => d[model.y];
        return function (d) {
            return scale(value(d));
        };
    },

    getStack () {
        var model = this.getModel();
        if (model.stack) {
            var s = d3_shape.stack();
            if (model.stackOrder) s.order(model.stackOrder);
            return s;
        }
    }
};

//
//  Line Chart
//  =============
//
//  The barchart is one of the most flexible visuals.
//  It can be used to display label data as well as
//  timeserie data. It can display absulte values as
//  proportional data via vertical staking and normalization
export default createChart('linechart', lineDrawing, {

    options: {
        lineWidth: 1,
        curve: 'natural',
        x: 'x',
        y: 'y',
        groupby: null,  // group data by a field for grouped line charts
        scaleX: 'linear',
        scaleY: 'linear',
        //
        axisX: true,
        axisY: true
    },

    doDraw (frame) {
        var model = this.getModel(),
            x = model.x,
            y = model.y,
            box = this.boundingBox(),
            info = grouper()
                        .groupby(model.groupby)
                        .x(x)
                        .y(y)(frame),
            domainX = info.rangeX(),
            domainY = info.rangeY(),
            sx = this.getScale(model.scaleX)
                            .domain(domainX)
                            .rangeRound([0, box.innerWidth]),
            sy = this.getScale(model.scaleY)
                            .domain(domainY)
                            .rangeRound([box.innerHeight, 0]).nice(),
            group = this.group(),
            chart = this.group('chart'),
            lines = chart.selectAll('.line').data(info.data),
            colors = this.stroke(info.data).colors,
            sxshift = 0,
            //merge = paper.transition('update'),
            line_ = line()
                .x(xl)
                .y(yl)
                .curve(this.curve(model.curve));

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left, box.margin.top));

        // TODO: generalize this hack
        if (isFunction(sx.bandwidth)) {
            sx.domain(info.data[0].map(d => d.data[x]));
            sxshift = sx.bandwidth()/2;
        }

        lines
            .enter()
                .append('path')
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', stroke)
                .attr('stroke-width', model.lineWidth)
                .attr('d', line_)
            .merge(lines)
                .transition()
                .attr('stroke', stroke)
                .attr('stroke-width', model.lineWidth)
                .attr('d', line_);

        lines
            .exit()
            .transition()
            .style('opacity', 0)
            .remove();

        if (model.axisX)
            this.xAxis1(model.axisX === true ? "bottom" : model.axisX, sy, box);
        if (model.axisY)
            this.yAxis1(model.axisY === true ? "left" : model.axisY, sy, box);

        function stroke (d, i) {
            return colors[i];
        }

        function xl(d) {
            return sx(d.data[x]) + sxshift;
        }

        function yl(d) {
            return sy(d[1]);
        }
    }
});
