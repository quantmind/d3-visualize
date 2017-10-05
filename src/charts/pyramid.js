import {symbol} from 'd3-shape';
import {viewExpression} from 'd3-view';

import createChart from '../core/chart';
import pyramid from '../transforms/pyramid';
import polygon from '../utils/polygon';
import {proportional} from './pie';


export default createChart('pyramidchart', proportional, {

    options: {
        field: 'data',
        label: 'label',
        pad: 0,
        lineWidth: 1,
        inverted: false,
        legendType: 'color',
        legendLabel: "label + ' - ' + format('.1%', fraction)"
    },

    doDraw (frame) {
        var model = this.getModel(),
            field = model.field,
            color = this.getModel('color'),
            box = this.boundingBox(),
            pad = this.dim(model.pad, Math.min(box.innerWidth, box.innerHeight)),
            polygons = pyramid()
                .base(box.innerWidth)
                .height(box.innerHeight)
                .pad(pad)
                .value(d => d[field]),
            data = frame.new(polygons(this.proportionalData(frame, field))).dimension('fraction').bottom(Infinity),
            marks = symbol().type(d => polygon(d.points)).size(1),
            fill = this.fill(data),
            paper = this.paper(),
            segments = paper.size(box).group()
                .attr("transform", this.translate(box.total.left+box.innerWidth/2, box.total.top))
                .selectAll('.segment').data(data);

        segments
            .enter()
                .append('path')
                .attr('class', 'segment')
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', 0)
                .attr('fill-opacity', 0)
                .attr('fill', fill)
                .attr('stroke-width', model.lineWidth)
            .merge(segments)
                .transition()
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', color.strokeOpacity)
                .attr('d', marks)
                .attr('fill', fill)
                .attr('fill-opacity', color.fillOpacity);

        segments.exit().remove();

        if (!model.legendType) return;
        var expr = viewExpression(model.legendLabel),
            self = this,
            labels = data.map((d, idx) => {
                return expr.eval(self.getContext({
                    d: d,
                    value: d.value,
                    fraction: d.fraction,
                    label: d.data[model.label] || idx
                }));
            });
        this.legend({
            scale: this.getScale('ordinal').domain(labels).range(fill.colors)
        }, box);
    }

});
