import {pie, arc} from 'd3-shape';
import {scaleOrdinal} from 'd3-scale';
import {viewExpression} from 'd3-view';
import {format} from 'd3-format';

import createChart from '../core/chart';
import {sizeValue} from '../utils/size';
import textWrap from '../utils/text-wrapping';


const pi = Math.PI;
const rad = pi/180;


export const proportional = {

    fill (data) {
        var colors = this.colors(data.length);

        function fill (d, idx) {
            return colors[idx];
        }

        fill.colors = colors;

        return fill;
    },

    proportionalData (frame, field) {
        return frame.dimension(field).top(Infinity);
    },

    total (field) {
        var total = 0;

        function value (d) {
            total += d[field];
            return d[field];
        }

        value.total = () => total;
        return value;
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
        label: 'label',
        startAngle: 0,
        endAngle: 360,
        sort: false,
        innerRadius: 0,
        padAngle: 0,
        cornerRadius: 0,
        lineWidth: 1,
        //
        fractionFormat: '.1%',
        legendType: 'color',
        legendLabel: "label + ' - ' + format(fraction)",
        //
        // display information in the center of the pie chart
        // Should be used with innerRadius greater than 0
        center: null,
        centerOpacity: 1,
        centerFontSize: '7%'
    },

    doDraw (frame) {
        var model = this.getModel(),
            color = this.getModel('color'),
            field = model.field,
            box = this.boundingBox(),
            outerRadius = Math.min(box.innerWidth, box.innerHeight)/2,
            innerRadius = sizeValue(model.innerRadius, outerRadius),
            total = this.total(field),
            angles = pie()
                .padAngle(rad*model.padAngle)
                .startAngle(rad*model.startAngle)
                .endAngle(rad*model.endAngle)
                .value(total),
            arcs = arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .cornerRadius(model.cornerRadius),
            paper = this.paper().size(box),
            //update = paper.transition('update'),
            data = angles(this.proportionalData(frame, field)),
            fill = this.fill(data),
            slices = paper.group()
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
                .transition()
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', color.strokeOpacity)
                .attr('d', arcs)
                .attr('fill', fill)
                .attr('fill-opacity', color.fillOpacity);

        slices.exit().transition().remove();

        if (model.center) {
            var text = this.dataStore.eval(model.center, {total: total.total()});
            if (text) {
                var size = this.dim(model.centerFontSize, box.innerWidth),
                    center = paper.group('center-notation')
                        .attr("transform", this.translate(box.total.left+box.innerWidth/2, box.total.top+box.innerHeight/2))
                        .selectAll('.info').data([text]);
                center
                    .enter()
                        .append('text')
                        .attr('class', 'info')
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "middle")
                        .style("font-size", `${size}px`)
                        .style('fill-opacity', 0)
                    .merge(center)
                        .text(text)
                        .style('fill-opacity', model.centerOpacity)
                        .call(textWrap, 1.5*(innerRadius || outerRadius));

            }
        }
        if (!model.legendType) return;
        total = total.total();
        var expr = viewExpression(model.legendLabel),
            fmt = format(model.fractionFormat),
            labels = data.map((d, idx) => {
                return expr.eval({
                    d: d,
                    value: d.value,
                    format: fmt,
                    total: total,
                    fraction: d.value/total,
                    label: d.data[model.label] || idx
                });
            });
        this.legend({
            scale: scaleOrdinal().domain(labels).range(fill.colors)
        }, box);
    }
});
