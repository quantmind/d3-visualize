import {area, line} from 'd3-shape';
import {format} from 'd3-format';
import {timeFormat} from 'd3-time-format';
import {isDate} from 'd3-let';

import createChart from '../core/chart';
import constant from '../utils/constant';
import {lineDrawing} from './line';

//
//  Area Chart
//  =============
export default createChart('areachart', lineDrawing, {

    options: {
        lineWidth: 1,
        curve: 'cardinalOpen',
        x: 'x',
        y: 'y',
        scaleX: 'linear',
        scaleY: 'linear',
        // area with vertical gradient to zero opacity
        gradient: true,
        //
        axisX: 'bottom',
        axisXticks: 5,
        axisY: 'left',
        axisYticks: 5,
        //
        axisFormat: ',',
        axisTimeFormat: '%Y-%m-%d',
        axisTickSizeOuter: 0
    },

    doDraw (frame) {
        var self = this,
            model = this.getModel(),
            color = this.getModel('color'),
            info = self.getDataInfo(frame),
            box = this.boundingBox(),
            paper = this.paper().size(box),
            areas = paper.group()
                .attr("transform", this.translate(box.total.left, box.total.top))
                .selectAll('.area').data(info.data),
            lines = paper.group('lines')
                .attr("transform", this.translate(box.total.left, box.total.top))
                .selectAll('.line').data(info.data),
            fill = this.fill(info.meta),
            curve = this.curve(model.curve);

        // TODO: fix this hack
        info.range.y[0] = 0;
        var line_ = line()
                .x(this.x(box, info.range.x))
                .y(this.y(box, info.range.y))
                .curve(curve),
            area_ = area()
                .x(this.x(box, info.range.x))
                .y1(this.y(box, info.range.y))
                .y0(this.y(box, info.range.y, constant(0)))
                .curve(curve);

        lines
            .enter()
                .append('path')
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', 0)
                .attr('stroke-width', model.lineWidth)
                .attr('d', line_)
            .merge(lines)
                .transition()
                .attr('d', line_)
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', color.strokeOpacity)
                .attr('stroke-width', model.lineWidth);

        lines
            .exit()
            .remove();

        areas
            .enter()
                .append('path')
                .attr('class', 'area')
                .attr('fill', fill)
                .attr('stroke', 'none')
                .attr('stroke-width', 0)
                .attr('d', area_)
            .merge(areas)
                .transition()
                .attr('d', area_)
                .attr('fill', fill)
                .attr('fill-opacity', color.fillOpacity);

        areas
            .exit()
            .remove();

        if (model.axisX) {
            var sx = this.getScale(model.scaleX)
                    .domain(info.range.x)
                    .range([0, box.innerWidth]),
                xa = this.axis(model.axisX, sx)
                    .ticks(this.ticks(box.innerWidth, 50))
                    .tickFormat(this.format(info.range.x[0]))
                    .tickSizeOuter(model.axisTickSizeOuter);
            paper
                .group('x-axis')
                .attr("transform", this.translate(box.total.left, box.total.top+box.innerHeight))
                .call(xa);
        }
        if (model.axisY) {
            var sy = this.getScale(model.scaleY)
                    .domain(info.range.y)
                    .range([box.innerHeight, 0]),
                ya = this.axis(model.axisY, sy)
                        .ticks(this.ticks(box.innerHeight, 30))
                        .tickFormat(this.format(info.range.y[0]))
                        .tickSizeOuter(model.axisTickSizeOuter);
            paper
                .group('y-axis')
                .attr("transform", this.translate(box.total.left, box.total.top))
                .call(ya);
        }
    },

    format (value) {
        if (isDate(value)) return timeFormat(this.getModel().axisTimeFormat);
        else return format(this.getModel().axisFormat);
    },

    ticks (size, spacing) {
        return Math.max(Math.floor(size/spacing), 1);
    }
});
