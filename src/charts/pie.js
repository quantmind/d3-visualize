import {pie, arc} from 'd3-shape';

import createChart from '../core/chart';

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
        field: null,
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
        var model = this.model,
            cscale = model.colorScale,
            box = this.boundingBox(),
            outerRadius = box.innerWidth/2,
            innerRadius = model.innerRadius*outerRadius,
            angles = pie()
                .padAngle(rad*model.padAngle)
                .startAngle(rad*model.startAngle),
            arcs = arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .cornerRadius(model.cornerRadius),
            paper = this.paper(),
            update = paper.transition('update'),
            fill = this.scaled(this.accessor(model.field), cscale),
            slices = paper
                .sel
                .attr("transforms", this.translate(box.shift.left+outerRadius, box.shift.top+outerRadius))
                .selectAll('.slice').data(angles(frame));

        slices
            .enter()
                .append('path')
                .attr('class', 'slice')
                .attr('stroke', model.color)
                .attr('stroke-opacity', 0)
                .attr('fill-opacity', 0)
                .attr('fill', fill)
                .attr('stroke-width', paper.dim(model.lineWidth))
            .merge(slices)
                .transition(update)
                .attr('stroke', model.color)
                .attr('stroke-opacity', model.colorOpacity)
                .attr('d', arcs)
                .attr('fill', fill)
                .attr('fill-opacity', model.fillOpacity);

        slices.exit().remove();
    }
});
