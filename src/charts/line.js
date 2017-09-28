import * as d3_shape from 'd3-shape';
import {extent} from 'd3-array';

import createChart from '../core/chart';
import warn from '../utils/warn';
import accessor from '../utils/accessor';
import camelFunction from '../utils/camelfunction';


export const lineDrawing = {

    fill (meta) {
        var cscale = this.colorScale().domain([0, meta.length-1]);

        function fill (d, index) {
            return cscale(index);
        }

        fill.scale = cscale;

        return fill;
    },

    curve (name) {
        var obj = camelFunction(d3_shape, 'curve', name);
        if (!obj) {
            warn(`Could not locate curve type "${name}"`);
            obj = camelFunction(d3_shape, 'curve', 'cardinalOpen');
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
        curve: 'cardinalOpen',
        x: 'x',
        y: 'y',
        scaleX: 'linear',
        scaleY: 'linear'
    },

    doDraw (frame) {
        var self = this,
            range = this.newRange(),
            model = this.getModel(),
            color = this.getModel('color'),
            x = accessor(model.x),
            y = accessor(model.y),
            data = frame.series.values(),
            meta = frame.series.keys().map((label, index) => {
                return {
                    index: index,
                    label: label,
                    range: self.range(data[index], x, y, range)
                };
            }),
            box = this.boundingBox(),
            paper = this.paper(),
            lines = paper.size(box).group()
                .attr("transform", this.translate(box.total.left, box.total.top))
                .selectAll('.line').data(data),
            strokeColor = this.fill(meta),
            //merge = paper.transition('update'),
            line = d3_shape.line()
                .x(this.x(box, range.x))
                .y(this.y(box, range.y))
                .curve(this.curve(model.curve));

        lines
            .enter()
                .append('path')
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', strokeColor)
                .attr('stroke-opacity', 0)
                .attr('stroke-width', model.lineWidth)
            .merge(lines)
                //.transition(merge)
                .attr('stroke', strokeColor)
                .attr('stroke-opacity', color.strokeOpacity)
                .attr('stroke-width', model.lineWidth)
                .attr('d', line);

        lines
            .exit()
            .remove();
    },

    x (box, ranges) {
        var model = this.getModel(),
            scale = self.getScale(model.scaleX)
                .domain(extent(ranges))
                .range([0, box.innerWidth]);
        return function (d) {
            return scale(d[model.x]);
        };
    },

    y (box, ranges) {
        var model = this.getModel(),
            scale = self.getScale(model.scaleY)
                .domain(extent(ranges))
                .range([box.innerHeight, 0]);
        return function (d) {
            return scale(d[model.y]);
        };
    }
});
