import {stack, stackOrderDescending} from 'd3-shape';
import {max} from 'd3-array';

import createChart from '../core/chart';
import {lineDrawing} from './line';
//
//  Bar Chart
//  =============
//
//  The barchart is one of the most flexible visuals.
//  It can be used to display label data as well as
//  timeserie data. It can display absulte values as
//  proportional data via vertical staking and normalization
export default createChart('barchart', lineDrawing, {

    options: {
        orientation: 'vertical',
        // stack multiple y series?
        sortby: null, // specify "x" or "y"
        stack: true,
        normalize: false,
        scale: 'linear',
        padding: 0.2,
        x: 'x',
        y: 'y',
        groupby: null,  // group data by a field for staked or grouped bar chart
        //
        axisY: 'left',
        axisX: 'bottom',
        //
        // legend & tooltip
        valueformat: '.1f',
        legendType: 'color',
        legendLabel: 'label'
    },

    doDraw (frame) {
        var model = this.getModel(),
            color = this.getModel('color'),
            data = frame.data,
            box = this.boundingBox(),
            paper = this.paper().size(box),
            bars = paper.group()
                .attr("transform", this.translate(box.total.left, box.total.top))
                .selectAll('.group'),
            x = model.x,
            y = model.y,
            groupby = model.groupby,
            sx = this.getScale('band'),
            sy = this.getScale(model.scale),
            sz = this.getScale('ordinal');

        let stacked = false,
            width = null,
            height = null,
            xrect, yrect, yi, groups, rects, axis;

        if (model.orientation === 'vertical') {
            sx.rangeRound([0, box.innerWidth]).paddingInner(model.padding);
            sy.rangeRound([box.innerHeight, 0]);
            width = sx.bandwidth;
            height = bardim;
        } else {
            sx.rangeRound([0, box.innerHeight]).paddingInner(model.padding);
            sy.rangeRound([0, box.innerWidth]);
            width = bardim;
            height = sx.bandwidth;
        }

        if (groupby) {
            groups = frame.dimension(groupby).group().top(Infinity).map(g => g['key']);
            if (groups.length <= 1) groups = null;
        }

        if (groups) {
            var gframe = frame.pivot(x, groupby, y);
            if (model.sortby === 'y') gframe = gframe.sortby('total');
            data = gframe.data;
            sz.domain(groups).range(this.colors(groups.length));
            if (model.stack) {
                if (model.normalize)
                    data = this.normalize(gframe);
                stacked = true;
            }
        }

        // set domain for the labels
        sx.domain(data.map(d => d[x]));

        //
        // Stacked bar chart
        if (stacked) {
            if (model.orientation === 'vertical') {
                xrect = x0;
                yrect = y0;
                yi = 1;
            } else {
                xrect = y0;
                yrect = x0;
                yi = 0;
            }
            sy.domain([0, max(data, d => d.total)]).nice();
            data = stack().order(stackOrderDescending).keys(groups)(data);
            rects = bars.data(data)
                        .enter()
                            .append('g')
                            .classed('group', true)
                            .attr('fill', d => sz(d.key))
                        .merge(bars)
                            .attr('fill', d => sz(d.key))
                            .attr('stroke', color.stroke)
                            .attr('stroke-opacity', color.strokeOpacity)
                            .attr('fill-opacity', color.fillOpacity)
                            .selectAll('rect')
                            .data(d => d);
            rects.enter()
                .append('rect')
                    .attr('x', xrect)
                    .attr('y', yrect)
                    .attr('height', height)
                    .attr('width', width)
                    .on("mouseover", this.mouseOver())
                    .on("mouseout", this.mouseOut())
                .merge(rects)
                    .transition()
                    .attr('x', xrect)
                    .attr('y', yrect)
                    .attr('height', height)
                    .attr('width', width);

        } else if (groups) {
            //
            //  Grouped bar chart
            var x1 = this.getScale('band')
                            .domain(groups)
                            .paddingInner(0.5*model.padding);

            // set the value domain
            sy.domain([0, max(frame.data, d => d[y])]).nice();

            if (model.orientation === 'vertical') {
                x1.rangeRound([0, sx.bandwidth()]);
                xrect = gx;
                width = x1.bandwidth;
                height = gh;
            } else {
                yrect = gx;
                height = x1.bandwidth;
                width = gh;
            }

            bars = bars.data(data);
            bars.exit().remove();
            //
            // join for rectangles
            rects = bars
                .enter()
                    .append('g')
                    .classed('group', true)
                    .attr("transform", d => this.translate(xrect(d), 0))
                .merge(bars)
                    .attr("transform", d => this.translate(xrect(d), 0))
                    .selectAll('rect')
                    .data(groupData);
            //
            rects.exit()
                .transition()
                .style('opacity', 0)
                .remove();
            //
            rects
                .enter()
                    .append('rect')
                    .attr('x', d => x1(d.key))
                    .attr('y', gy)
                    .attr('height', height)
                    .attr('width', width)
                    .attr('stroke', color.stroke)
                    .attr('stroke-opacity', 0)
                    .attr('fill-opacity', 0)
                    .attr('fill', d => sz(d.key))
                    .on("mouseover", this.mouseOver())
                    .on("mouseout", this.mouseOut())
                .merge(rects)
                    .transition()
                    .attr('x', d => x1(d.key))
                    .attr('y', gy)
                    .attr('height', height)
                    .attr('width', width)
                    .attr('stroke', color.stroke)
                    .attr('stroke-opacity', color.strokeOpacity)
                    .attr('fill-opacity', color.fillOpacity)
                    .attr('fill', d => sz(d.key));

            rects.exit().remove();
        }

        // Axis
        if (model.orientation === 'vertical') {
            if (model.axisX) {
                axis = this.axis(model.axisX, sx).tickSizeOuter(0);
                paper.group('x-axis')
                    .attr("transform", this.translate(box.total.left, box.total.top+box.innerHeight))
                    .call(axis);
            }

            if (model.axisY) {
                this.yAxis(sy, box.total.left, box.total.top);
            }
        } else {
            axis = this.axis('left', sx).tickSizeOuter(0);
            paper.group('axis')
                .attr("transform", this.translate(box.total.left, box.total.top))
                .call(axis);
        }

        if (model.legendType && groups) {
            this.legend({scale: sz}, box);
        }

        // utilities for stacked charts
        function bardim (d) {
            return sy(d[1-yi]) - sy(d[yi]);
        }

        function x0 (d) {
            return sx(d.data[x]);
        }

        function y0 (d) {
            return sy(d[yi]);
        }

        // utilities for grouped charts
        function gx (d) {
            return sx(d[x]);
        }

        function gy (d) {
            return sy(d.value);
        }

        function gh (d) {
            return sy(0) - sy(d.value);
        }

        function groupData (d) {
            return groups.map(key => {
                return {key: key, value: d[key]};
            });
        }
    }
});
