import {area, line} from 'd3-shape';

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
        gradient: true
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
    }
});
