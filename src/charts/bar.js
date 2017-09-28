import {stack} from 'd3-shape';
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
        padding: 0.1,
        x: 'x',
        y: 'y',
        groupby: null,  // group data by a field for staked or grouped bar chart
        //
        // legend & tooltip
        valueformat: '.1f',
        legendType: 'color',
        legendLabel: 'label'
    },

    doDraw (frame) {
        var model = this.getModel(),
            // color = this.getModel('color'),
            data = frame.data,
            box = this.boundingBox(),
            paper = this.paper(),
            bars = paper.size(box).group()
                .attr("transform", this.translate(box.total.left, box.total.top))
                .selectAll('.group'),
            x = model.x,
            y = model.y,
            groupby = model.groupby,
            sx = this.getScale('band'),
            sy = this.getScale(model.scale),
            sz = this.getScale('ordinal'),
            stacked = false,
            width = null,
            height = null,
            xrect = x0,
            yrect = y0,
            yi = 1,
            groups;

        if (model.orientation === 'vertical') {
            sx.rangeRound([0, box.innerWidth]).paddingInner(model.padding);
            sy.rangeRound([box.innerHeight, 0]);
            width = sx.bandwidth;
            height = bardim;
        } else {
            sx.rangeRound([0, box.innerHeight]).paddingInner(model.padding);
            sy.rangeRound([0, box.innerWidth]);
            yi = 0;
            width = bardim;
            height = sx.bandwidth;
            xrect = y0;
            yrect = x0;
        }

        if (groupby) {
            groups = frame.dimension(groupby).group().top(Infinity).map(g => g['key']);
            if (groups.length <= 1) groups = null;
        }

        if (groups) {
            frame = frame.pivot(x, groupby, y);
            if (model.sortby === 'y') frame = frame.sortby('total');
            data = frame.data;
            sz.domain(groups).range(this.colors(data.length));
            if (model.stack) {
                if (model.normalize)
                    this.normalize(frame.data);
                stacked = true;
            }
        }

        // set domain for the labels
        sx.domain(data.map(d => d[x]));

        if (stacked) {
            sy.domain([0, max(data, d => d.total)]).nice();
            data = stack().keys(groups)(data);
            var rects = bars.data(data)
                            .enter()
                            .append('g')
                                .classed('group', true)
                                .attr('fill', d => sz(d.key))
                            .merge(bars)
                                .selectAll('rect')
                                .data(d => d);
            rects.enter()
                .append('rect')
                .merge(rects)
                    .attr('x', xrect)
                    .attr('y', yrect)
                    .attr('height', height)
                    .attr('width', width);
        } else {
            var x1 = self.getScale('band').padding(0.5*model.padding);
            return x1;
        }

        if (model.legendType && groups) {
            this.legend({scale: sz}, box);
        }

        function bardim (d) {
            return sy(d[1-yi]) - sy(d[yi]);
        }

        function x0 (d) {
            return sx(d.data[x]);
        }

        function y0 (d) {
            return sy(d[yi]);
        }
    }
});
