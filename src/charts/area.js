import {area, line} from 'd3-shape';
import {format} from 'd3-format';
import {timeFormat} from 'd3-time-format';
import {isDate} from 'd3-let';
import {color} from 'd3-color';

import createChart from '../core/chart';
import grouper from '../transforms/groups';
import {lineDrawing} from './line';

//
//  Area Chart
//  =============
export default createChart('areachart', lineDrawing, {

    options: {
        lineWidth: 1,
        curve: 'natural',
        x: 'x',
        y: 'y',
        groupby: null,  // group data by a field for staked or grouped area chart
        scaleX: 'linear',
        scaleY: 'linear',
        // area with vertical gradient to zero opacity
        gradient: true,
        lineDarken: 0.2,
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
            x = model.x,
            y = model.y,
            col = this.getModel('color'),
            box = this.boundingBox(),
            info = grouper()
                        .groupby(model.groupby)
                        .stack(this.getStack())
                        .x(x)
                        .y(y)(frame),
            rangeX = info.rangeX(),
            rangeY = info.rangeY(),
            scaleX = this.getScale(model.scaleX)
                            .domain(rangeX)
                            .rangeRound([0, box.innerWidth]),
            scaleY = this.getScale(model.scaleY)
                            .domain(rangeY)
                            .rangeRound([box.innerHeight, 0]).nice(),
            paper = this.paper().size(box),
            areas = paper.group()
                .attr("transform", this.translate(box.total.left, box.total.top))
                .selectAll('.areagroup').data(info.data),
            colors = this.colors(info.data.length),
            fill = model.gradient ? colors.map((c, i) => self.linearGradient(c, box, 'vertical', `fill${self.model.uid}-${i}`)) : colors,
            curve = this.curve(model.curve);

        var areagroup = areas
            .enter()
                .append('g')
                .classed('areagroup', true)
            .merge(areas)
                .selectAll('path')
                .data(arealine);

        areagroup
            .enter()
                .append('path')
                .attr('class', d => d.type)
                .attr('fill', d => d.fill)
                .attr('stroke', d => d.stroke)
                .attr('d', d => d.draw)
            .merge(areagroup)
                .attr('d', d => d.draw)
                .attr('fill', d => d.fill)
                .attr('stroke', d => d.stroke)
                .attr('fill-opacity', col.fillOpacity)
                .attr('fill-opacity', col.fillOpacity)
                .attr('stroke-width', model.lineWidth);

        areagroup
            .exit()
            .transition()
            .remove();

        if (model.axisX) {
            var xa = this.axis(model.axisX, scaleX)
                    .ticks(this.ticks(box.innerWidth, 50))
                    .tickFormat(this.format(rangeX[0]))
                    .tickSizeOuter(model.axisTickSizeOuter);
            paper
                .group('x-axis')
                .attr("transform", this.translate(box.total.left, box.total.top+box.innerHeight))
                .call(xa);
        }
        if (model.axisY) {
            var ya = this.axis(model.axisY, scaleY)
                        .ticks(this.ticks(box.innerHeight, 30))
                        .tickFormat(this.format(rangeY[0]))
                        .tickSizeOuter(model.axisTickSizeOuter);
            paper
                .group('y-axis')
                .attr("transform", this.translate(box.total.left, box.total.top))
                .call(ya);
        }

        function xx(d) {
            return scaleX(d.data[x]);
        }

        function y0(d) {
            return scaleY(d[0]);
        }

        function y1(d) {
            return scaleY(d[1]);
        }

        function arealine (d) {
            var area_ = area()
                            .curve(curve)
                            .x(xx)
                            .y1(y1)
                            .y0(y0),
                line_ = line()
                            .curve(curve)
                            .x(xx)
                            .y(y1),
                c = color(colors[d.index]);

            return [
                {
                    type: 'area',
                    data: d,
                    draw: area_(d),
                    stroke: 'none',
                    fill: fill[d.index]
                },
                {
                    type: 'line',
                    data: d,
                    draw: line_(d),
                    fill: 'none',
                    stroke: c.darker(model.lineDarken)
                }
            ];
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
