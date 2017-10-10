import {extent, range} from 'd3-array';
import {map} from 'd3-collection';

import accessor from '../utils/accessor';
import niceRange from '../utils/nicerange';
import createChart from '../core/chart';
import {lineDrawing} from './line';
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
export default createChart('heatmap', lineDrawing, {

    options: {
        shape: 'square',
        layout: 'heatmap',
        buckets: 10,
        pad: 0.005,     // padding for heatmap & punchcard
        x: 'x',
        y: 'y',
        z: 'data',
        axisX: 'bottom',
        axisY: 'left'
    },

    doDraw (frame) {
        var model = this.getModel(),
        color = this.getModel('color'),
            layout = model.layout,
            box = this.boundingBox(),
            zrange = extent(frame.data, accessor(model.z)),
            paper = this.paper().size(box);

        if (zrange[0] < 0 && layout === 'punchcard') layout = 'heatmap';

        var heat = this.heatmap(layout, frame, box, zrange),
            dx = (box.innerWidth - heat.width)/2,
            dy = (box.innerHeight - heat.height)/2,
            shape = this.getSymbol(model.shape).size(d => d.size*d.size),
            shapes = paper.group()
                        .attr("transform", this.translate(box.total.left + dx, box.total.top + dy))
                        .selectAll('.shape')
                        .data(heat.data);

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
            .merge(shapes)
                .transition()
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
                .attr("fill-opacity", color.fillOpacity)
                .attr("fill", d => d.color)
                .attr("stroke-opacity", color.strokeOpacity)
                .attr("stroke", color.stroke)
                .attr('d', shape);

        if (model.axisX === 'bottom')
            this.xAxis(heat.scaleX, box.total.left, box.total.top + heat.height + dy);
        if (model.axisY === 'left')
            this.yAxis(heat.scaleY, box.total.left, box.total.top + dy);

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
            colors = this.getScale('quantile').range(this.colors(buckets).reverse()).domain(zrange);
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
