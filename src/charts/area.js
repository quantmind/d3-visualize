import {area, line} from 'd3-shape';
import {format} from 'd3-format';
import {timeFormat} from 'd3-time-format';
import {isDate} from 'd3-let';

import createChart from '../core/chart';
import constant from '../utils/constant';
import grouper from '../transforms/groups';
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
        groupby: null,  // group data by a field for staked or grouped area chart
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
            info = grouper()
                        .groupby(model.groupby)
                        .stack(this.getStack())
                        .x(model.x)
                        .y(model.y)(frame),
            rangeX = info.rangeX(),
            rangeY = info.rangeY(),
            box = this.boundingBox(),
            paper = this.paper().size(box),
            areas = paper.group()
                .attr("transform", this.translate(box.total.left, box.total.top))
                .selectAll('.areagroup').data(info.data),
            fill = this.fill(info.data),
            curve = this.curve(model.curve),
            data = info.data;

        // TODO: fix this hack
        rangeY[0] = Math.min(0, rangeY[0]);

        var line_ = line()
                .x(this.x(box, rangeX))
                .y(this.y(box, rangeY))
                .curve(curve),
            area_ = area()
                .x(this.x(box, rangeX))
                .y1(this.y(box, rangeY))
                .y0(this.y(box, rangeY, constant(0)))
                .curve(curve);

        var areagroup = areas
            .enter()
                .append('g')
                .classed('areagroup', true)
            .merge(areas)
                .selectAll('path')
                .data(d => [{
                    type: 'area',
                    fill: fill,
                    data: d
                }, {
                    type: 'line',
                    data: d,
                    fill: 'none'
                }]);

        var areapath = areagroup
                        .enter()
                            .append('path')
                            .data(d => d)
                            .attr('class', d => d.type)
                            .attr('fill', d => d.fill)


        areapath
                .append('path')
                .attr('class', 'area')
                .attr('fill', fill)
                .attr('stroke', 'none')
                .attr('stroke-width', 0)
                .attr('d', area_);

        areapath.merge(areagroup)
                .transition()
                .attr('d', area_)
                .attr('fill', fill)
                .attr('fill-opacity', color.fillOpacity);

        areapath
                .append('path')
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', 0)
                .attr('stroke-width', model.lineWidth)
                .attr('d', line_)
            .merge(areagroup)
                .transition()
                .attr('d', line_)
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', color.strokeOpacity)
                .attr('stroke-width', model.lineWidth);

        areagroup
            .exit()
            .transition()
            .remove();

        if (model.axisX) {
            var sx = this.getScale(model.scaleX)
                    .domain(rangeX)
                    .range([0, box.innerWidth]),
                xa = this.axis(model.axisX, sx)
                    .ticks(this.ticks(box.innerWidth, 50))
                    .tickFormat(this.format(rangeX[0]))
                    .tickSizeOuter(model.axisTickSizeOuter);
            paper
                .group('x-axis')
                .attr("transform", this.translate(box.total.left, box.total.top+box.innerHeight))
                .call(xa);
        }
        if (model.axisY) {
            var sy = this.getScale(model.scaleY)
                    .domain(rangeY)
                    .range([box.innerHeight, 0]),
                ya = this.axis(model.axisY, sy)
                        .ticks(this.ticks(box.innerHeight, 30))
                        .tickFormat(this.format(rangeY[0]))
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
