import symbol from 'd3-shape';

import createChart from '../core/chart';
import pyramid from '../transforms/pyramid';
import polygon from '../utils/polygon';
import {proportional} from './pie';
import {sizeValue} from '../utils/size';


export default createChart('pyramidchart', proportional, {

    options: {
        field: null,
        pad: 0,
        lineWidth: 0
    },

    doDraw (frame) {
        var model = this.getModel(),
            color = this.getModel('color'),
            box = this.boundingBox(),
            pad = sizeValue(model.pad, Math.min(box.innerWidth, box.innerHeight)),
            polygons = pyramid().base(box.innerWidth).height(box.innerHeight).pad(pad),
            data = frame,
            marks = symbol().type(d => polygon(d.points)).size(1),
            fill = this.fill(data),
            paper = this.paper(),
            segments = paper
                .sel
                .attr("transforms", this.translate(box.shift.left+box.innerWidth/2, box.shift.top))
                .selectAll('.segment').data(polygons(data));

        segments
            .enter()
                .append('path')
                .attr('class', 'segment')
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', 0)
                .attr('fill-opacity', 0)
                .attr('fill', fill)
                .attr('stroke-width', paper.dim(model.lineWidth))
            .merge(segments)
                //.transition(update)
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', model.strokeOpacity)
                .attr('d', marks)
                .attr('fill', fill)
                .attr('fill-opacity', color.fillOpacity);

        segments.exit().remove();
    }

});
