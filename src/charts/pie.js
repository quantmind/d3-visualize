import {pie, arc} from 'd3-shape';

import createChart from '../core/chart';
import {sizeValue} from '../utils/size';

const pi = Math.PI;
const rad = pi/180;


export const proportional = {
    fill (data) {
        var cscale = this.colorScale().domain([0, data.length-1]);

        function fill (d) {
            return cscale(d.index);
        }

        fill.scale = cscale;

        return fill;
    },

    proportionalData (frame, field) {
        return frame.dimension(d => d[field]).top(Infinity);
    }
};

//
//  Pie Chart
//  =============
//
export default createChart('piechart', proportional, {

    options: {
        // The data values from this field will be encoded as angular spans.
        // If omitted, all pie slices will have equal spans
        field: 'data',
        startAngle: 0,
        endAngle: 360,
        sort: false,
        innerRadius: 0,
        padAngle: 0,
        cornerRadius: 0,
        //
        color: null,
        lineWidth: 1,
        colorOpacity: 1,
        fillOpacity: 1
    },

    doDraw (frame) {
        var model = this.getModel(),
            color = this.getModel('color'),
            field = model.field,
            box = this.boundingBox(),
            outerRadius = Math.min(box.innerWidth, box.innerHeight)/2,
            innerRadius = sizeValue(model.innerRadius, outerRadius),
            angles = pie()
                .padAngle(rad*model.padAngle)
                .startAngle(rad*model.startAngle)
                .endAngle(rad*model.endAngle)
                .value(d => d[field]),
            arcs = arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .cornerRadius(model.cornerRadius),
            paper = this.paper(),
            //update = paper.transition('update'),
            data = angles(this.proportionalData(frame, field)),
            fill = this.fill(data),
            slices = paper.size(box).group()
                .attr("transform", this.translate(box.total.left+box.innerWidth/2, box.total.top+box.innerHeight/2))
                .selectAll('.slice').data(data);

        slices
            .enter()
                .append('path')
                .attr('class', 'slice')
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', 0)
                .attr('fill-opacity', 0)
                .attr('fill', fill)
                .attr('stroke-width', model.lineWidth)
            .merge(slices)
                //.transition(update)
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', color.strokeOpacity)
                .attr('d', arcs)
                .attr('fill', fill)
                .attr('fill-opacity', color.fillOpacity);

        slices.exit().remove();
    }
});
