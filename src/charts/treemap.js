import {format} from 'd3-format';

import createChart from '../core/chart';
import camelFunction from '../utils/camelfunction';
import accessor from '../utils/accessor';
import colorContrast from '../utils/contrast';

//
//  Treemap
//  =============
//
export default createChart('treemap', {
    requires: ['d3-scale', 'd3-hierarchy'],

    options: {
        label: 'label',
        field: 'data',
        padding: 2,
        tile: 'resquarify',
        format: ','
    },

    doDraw (frame, d3) {
        var model = this.getModel(),
            font = this.getModel('font'),
            box = this.boundingBox(),
            labelAccessor = accessor(model.label),
            valueAccessor = accessor(model.field),
            valueFormat = format(model.format),
            root = d3.hierarchy(rootData(frame.data))
                    .sum(valueAccessor)
                    .sort((a, b) => b.value - a.value)
                    .eachBefore(dataColor),
            treemap = d3.treemap()
                        .tile(camelFunction(d3, 'treemap', model.tile, true))
                        .size([box.innerWidth, box.innerHeight])
                        .round(true)
                        .padding(model.padding),
            colors = this.fill(root.children).colors,
            group = this.group()
                        .attr("transform", this.translate(box.total.left, box.total.top))
                        .style("shape-rendering", "crispEdges"),
            leaves = treemap(root).leaves(),
            cell = group.selectAll('g').data(leaves),
            self = this;

        this.paper().size(box);
        cell.exit().remove();

        cell = cell
            .enter()
                .append('g')
                .attr("transform", d => this.translate(d.x0, d.y0))
            .merge(cell)
                .attr("transform", d => this.translate(d.x0, d.y0));

        var rects = cell.selectAll('rect').data(singleData);

        rects.enter()
                .append('rect')
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0)
                .attr("fill", d => colors[d.data._counter])
                .attr('stroke', 'none')
                .on("mouseover", this.mouseOver())
                .on("mouseout", this.mouseOut())
            .merge(rects)
                .transition()
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0)
                .attr("fill", d => colors[d.data._counter]);

        rects = cell.selectAll('text').data(singleData);
        rects.enter()
            .append("text")
            .style('fill', d => colorContrast(colors[d.data._counter], '#fff', font.stroke))
            .selectAll("tspan")
                .data(textData)
                .enter()
                    .append("tspan")
                    .style('font-size', d => d.size)
                    .attr("x", 4)
                    .attr("y", (d, i) => 1.5*d.size + i * 1.2 * d.size)
                    .text(d => d.text);


        function dataColor (d) {
            if (!d.parent) d.data._counter = 0;
            else {
                d.data._counter = d.parent.data._counter;
                d.parent.data._counter++;
            }
        }

        function rootData (data) {
            data = {children: hideChildren(data)};
            data[model.label] = 'root';
            return data;
        }

        function textData (d) {
            var size = self.font({height: Math.min(d.x1 - d.x0, d.y1 - d.y0)}),
                text = labelAccessor(d.data).split(/(?=[A-Z][^A-Z])/g);
            text.push(valueFormat(d.value));
            return text.map(t => {return {size:size, text:t};});
        }

        function singleData (d) {
            return [d];
        }

        function hideChildren (data) {
            let children;
            return data.map(d => {
                children = d.children;
                if (children) {
                    d._children = hideChildren(children);
                    delete d.children;
                }
                return d;
            });
        }
    }
});
