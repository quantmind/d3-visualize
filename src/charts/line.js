import {isFunction} from 'd3-let';

import createChart from '../core/chart';
import grouper from '../transforms/groups';
import defs from './defs';
//
//  Line Chart
//  =============
//
//  The barchart is one of the most flexible visuals.
//  It can be used to display label data as well as
//  timeserie data. It can display absulte values as
//  proportional data via vertical staking and normalization
export default createChart('linechart', {
    requires: ['d3-scale', 'd3-shape', 'd3-axis', 'd3-svg-legend'],

    schema: {
        lineWidth: defs.lineWidth,
        curve: defs.curve,
        x: defs.x,
        y: defs.y,
        scaleX: defs.scaleX,
        scaleY: defs.scaleY,
        groupby: defs.groupby,
        axisX: defs.axisX,
        axisY: defs.axisY
    },

    doDraw () {
        var model = this.getModel(),
            frame = this.frame,
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
            line_ = this.$.line()
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
