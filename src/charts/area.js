import {color} from 'd3-color';

import createChart from '../core/chart';
import grouper from '../transforms/groups';
import defs from './defs';

//
//  Area Chart
//  =============
export default createChart('areachart', {
    requires: ['d3-scale', 'd3-shape', 'd3-axis', 'd3-svg-legend'],

    schema: {
        lineWidth: defs.lineWidth,
        curve: defs.curve,
        x: defs.x,
        y: defs.y,
        scaleX: defs.scaleX,
        scaleY: defs.scaleY,
        groupby: defs.groupby,
        axisX: defs.axisX,
        axisY: defs.axisY,
        stack: defs.stack,
        gradient: defs.gradient,
        lineDarken: defs.lineDarken
    },

    doDraw () {
        var self = this,
            frame = this.frame,
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
            domainX = info.rangeX(),
            domainY = info.rangeY(),
            scaleX = this.getScale(model.scaleX)
                            .domain(domainX)
                            .rangeRound([0, box.innerWidth]),
            scaleY = this.getScale(model.scaleY)
                            .domain(domainY)
                            .rangeRound([box.innerHeight, 0]).nice(),
            group = this.group(),
            chart = this.group('chart'),
            areas = chart.selectAll('.areagroup').data(info.data),
            colors = this.colors(info.data.length),
            fill = model.gradient ? colors.map((c, i) => self.linearGradient(c, box, 'vertical', `fill${self.model.uid}-${i}`)) : colors,
            curve = this.getCurve(model.curve);

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left, box.margin.top));

        areas.exit()
            .transition()
            .style('opacity', 0)
            .remove();

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
                .transition(this.transition('area'))
                .attr('d', d => d.draw)
                .attr('fill', d => d.fill)
                .attr('stroke', d => d.stroke)
                .attr('fill-opacity', col.fillOpacity)
                .attr('stroke-width', model.lineWidth)
                .attr('stroke-opacity', col.strokeOpacity);

        areagroup
            .exit()
            .transition()
            .style('opacity', 0)
            .remove();

        if (model.axisX)
            this.xAxis1(model.axisX === true ? "bottom" : model.axisX, scaleX, box, domainX[0]);
        if (model.axisY)
            this.yAxis1(model.axisY === true ? "left" : model.axisY, scaleY, box, domainY[0]);

        if (info.data.length > 1)
            this.legend({
                type: 'color',
                scale: this.getScale('ordinal').range(colors).domain(info.data.map(d => d.key))
            }, box);

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
            var area_ = self.$.area()
                            .curve(curve)
                            .x(xx)
                            .y1(y1)
                            .y0(y0),
                line_ = self.$.line()
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

    ticks (size, spacing) {
        return Math.max(Math.floor(size/spacing), 1);
    }
});
