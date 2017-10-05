import {area} from 'd3-shape';

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
        scaleY: 'linear'
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
            fill = this.fill(info.meta);

        // TODO: fix this hack
        info.range.y[0] = 0;
        var area_ = area()
                .x(this.x(box, info.range.x))
                .y1(this.y(box, info.range.y))
                .y0(this.y(box, info.range.y, constant(0)))
                .curve(this.curve(model.curve));

        areas
            .enter()
                .append('path')
                .attr('class', 'area')
                .attr('fill', fill)
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', 0)
                .attr('fill-opacity', 0)
                .attr('stroke-width', model.lineWidth)
            .merge(areas)
                //.transition(merge)
                .attr('fill', fill)
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', color.strokeOpacity)
                .attr('fill-opacity', color.fillOpacity)
                .attr('stroke-width', model.lineWidth)
                .attr('d', area_);

        areas
            .exit()
            .remove();
    }
});
