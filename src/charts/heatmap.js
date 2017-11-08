import {extent, range} from 'd3-array';
import {map} from 'd3-collection';

import accessor from '../utils/accessor';
import niceRange from '../utils/nicerange';
import createChart from '../core/chart';
import colorContrast from '../utils/contrast';
import textWrap from '../utils/text-wrapping';
//
//  Heatmap
//  =============
//
//  A heatmap is a graphical representation of data where the individual
//  values contained in a matrix are represented as colors.
//  This chart type allow to specify to types of layout:
//  * heatmap - classical heatmap
//  * punchcard - the z dimension is converted into different sizes of the shape elements
//  * contour - similar to heatmap but continous rather than descrete
export default createChart('heatmap', {
    requires: ['d3-scale', 'd3-axis', 'd3-svg-legend'],

    options: {
        shape: 'square',
        layout: 'heatmap',
        buckets: 10,
        pad: 0.005,     // padding for heatmap & punchcard
        x: 'x',
        y: 'y',
        z: 'data',
        //
        label: null,    // expression for label text
        //
        axisX: true,
        axisY: true,
        reverseColors: true,
        tableColors: null
    },

    doDraw (frame) {
        var model = this.getModel(),
            color = this.getModel('color'),
            font = this.getModel('font'),
            layout = model.layout,
            box = this.boundingBox(),
            zrange = extent(frame.data, accessor(model.z));

        if (zrange[0] < 0 && layout === 'punchcard') layout = 'heatmap';

        var heat = this.heatmap(layout, frame, box, zrange),
            dx = (box.innerWidth - heat.width)/2,
            dy = (box.innerHeight - heat.height)/2,
            shape = this.getSymbol(model.shape).size(d => d.size*d.size),
            group = this.group(),
            chart = this.group('chart'),
            shapes = chart.selectAll('.shape').data(heat.data);

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left + dx, box.margin.top + dy));

        if (range[0] < 0 && layout === 'punchcard') layout = 'heatmap';

        shapes
            .enter()
                .append('path')
                .classed('shape', true)
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
                .attr("fill", d => d.color)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0)
                .attr("stroke", color.stroke)
                .attr('d', shape)
                .on("mouseover", this.mouseOver())
                .on("mouseout", this.mouseOut())
            .merge(shapes)
                .transition(this.transition())
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
                .attr("fill-opacity", color.fillOpacity)
                .attr("fill", d => d.color)
                .attr("stroke-opacity", color.strokeOpacity)
                .attr("stroke", color.stroke)
                .attr('d', shape);

        // add labels
        if (model.label && layout === 'heatmap') {
            var fontSize = `${this.font(box)}px`,
                labels = chart.selectAll('.labels').data(heat.data);
            labels
                .enter()
                    .append('text')
                    .classed('labels', true)
                    .attr("transform", d => `translate(${d.x}, ${d.y})`)
                    .style("text-anchor", "middle")
                    .style("alignment-baseline", "middle")
                    .style("fill", fillLabel)
                    .style('font-size', fontSize)
                    .text(heatLabel)
                .merge(labels)
                    .text(heatLabel)
                    .style('font-size', fontSize)
                    .call(textWrap, Math.ceil(0.8*heat.size))
                    .transition(this.transition('text'))
                    .attr("transform", d => `translate(${d.x}, ${d.y})`)
                    .style("fill", fillLabel);
        }

        var bb = {
            innerWidth: heat.width,
            innerHeight: heat.height,
            margin: {
                top: box.margin.top + dy,
                left: box.margin.left + dx
            }
        };
        if (model.axisX)
            this.xAxis1(model.axisX === true ? "bottom" : model.axisX, heat.scaleX, bb);
        if (model.axisY)
            this.yAxis1(model.axisY === true ? "left" : model.axisY, heat.scaleY, bb);

        if (layout === 'heatmap')
            this.legend({
                type: 'color',
                shape: model.shape,
                scale: heat.colors
            }, box);
        else if (layout === 'punchcard')
            this.legend({
                type: 'size',
                shape: model.shape,
                scale: heat.sizes
            }, box);

        function heatLabel (d) {
            return d.data[model.label];
        }

        function fillLabel (d) {
            return colorContrast(d.color, '#fff', font.stroke);
        }
    },

    heatmap (layout, frame, box, zrange) {
        var model = this.getModel(),
            pad = model.pad,
            x = model.x,
            y = model.y,
            z = model.z,
            gx = frame.dimension(model.x).group().size(),
            gy = frame.dimension(model.y).group().size(),
            buckets = Math.min(model.buckets, gx*gy),
            dx = (1 - pad*(gx + 1))*box.innerWidth/gx,
            dy = (1 - pad*(gy + 1))*box.innerHeight/gy,
            data = [],
            labelsX = [],
            labelsY = [],
            xp = map(), yp = map();

        let xv, yv, zv, i, j, colors, sizes, dd, width, height;

        if (dx < dy) {
            dd = dx;
            width = box.innerWidth;
            pad = width*pad;
            height = gy*(dd + pad) + pad;
        } else {
            dd = dy;
            height = box.innerHeight;
            pad = height*pad;
            width = gx*(dd + pad) + pad;
        }

        zrange = niceRange(zrange, buckets);

        if (layout === 'heatmap') {
            var cols = this.fill(range(buckets)).colors;
            if (model.reverseColors) cols = cols.reverse();
            colors = this.getScale('quantile').range(cols).domain(zrange);
            sizes = () => 1;
        } else {
            var color = this.colors(1)[0];
            colors = () => color;
            sizes = this.getScale('quantile').range(range(buckets).map(s => (s+1)/buckets)).domain(zrange);
        }
        frame.data.forEach(d => {
            xv = d[x];
            yv = d[y];
            zv = d[z];
            if (!xp.has(xv)) {
                xp.set(xv, labelsX.length);
                labelsX.push(xv);
            }
            if (!yp.has(yv)) {
                yp.set(yv, labelsY.length);
                labelsY.push(yv);
            }
            i = xp.get(xv);
            j = yp.get(yv);
            data.push({
                i: i,
                j: j,
                x: pad + dd/2 + i*(dd + pad),
                y: pad + dd/2 + j*(dd + pad),
                color: colors(zv),
                size: dd*sizes(zv),
                data: d
            });
        });
        return {
            data: data,
            size: dd,
            width: width,
            height: height,
            scaleX: this.getScale('band').domain(labelsX).range([0, width]),
            scaleY: this.getScale('band').domain(labelsY).range([0, height]),
            colors: colors,
            sizes: sizes
        };
    }
});
