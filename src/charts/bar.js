import assign from 'object-assign';
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
        scaleX: {
            type: 'band',
            padding: 0.2
        },
        scaleY: 'linear',
        x: 'x',
        y: 'y',
        radius: 0,
        groupby: null,  // group data by a field for staked or grouped bar chart
        //
        axisY: true,
        axisX: true,
        //
        // legend & tooltip
        valueformat: '.1f',
        legendType: 'color',
        legendLabel: 'label'
    },

    doDraw (frame) {
        var model = this.getModel(),
            data = frame.data,
            box = this.boundingBox(),
            group = this.group(),
            chart = this.group('chart'),
            bars = chart.selectAll('.group'),
            x = model.x,
            y = model.y,
            groupby = model.groupby,
            barChart = model.orientation === 'vertical' ? new VerticalBarChart(this) : new HorizontalBarChart(this);

        let groups, stacked = false;

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left, box.margin.top));

        if (groupby) {
            groups = frame.dimension(groupby).group().top(Infinity).map(g => g['key']);
            if (groups.length <= 1) groups = null;
        }

        if (groups) {
            var gframe = frame.pivot(x, groupby, y);
            if (model.sortby === 'y') gframe = gframe.sortby('total');
            data = gframe.data;
            barChart.sz.domain(groups).range(this.fill(groups).colors);
            if (model.stack) {
                if (model.normalize)
                    data = this.normalize(gframe);
                stacked = true;
            }
        } else {
            barChart.sz.domain([y]).range(this.fill([y]).colors);
            stacked = true;
        }

        // set domain for the labels
        var domainX = data.map(d => d[x]);
        barChart.sx.domain(domainX);
        //
        // Stacked bar chart
        if (stacked || !groups)
            barChart.stacked(bars, data, groups);
        else
            barChart.grouped(bars, data, groups);

        // Axis
        barChart.axis(domainX);
        // Legend
        barChart.legend(groups);
    }
});


function VerticalBarChart (viz) {
    this.vertical = true;
    this.init(viz);
    this.sx.rangeRound([0, this.box.innerWidth]);
    this.sy.rangeRound([this.box.innerHeight, 0]);
}

function HorizontalBarChart (viz) {
    this.init(viz);
    this.sx.rangeRound([0, this.box.innerHeight]);
    this.sy.rangeRound([0, this.box.innerWidth]);
}

const barChartPrototype = {

    init (viz) {
        this.viz = viz;
        this.model = viz.getModel();
        this.box = viz.boundingBox();
        this.sx = viz.getScale(this.model.scaleX),
        this.sy = viz.getScale(this.model.scaleY),
        this.sz = viz.getScale('ordinal');
    },

    legend (groups) {
        if (this.model.legendType && groups) {
            this.viz.legend({scale: this.sz}, this.box);
        }
    },

    stacked (bars, data, groups) {
        // TODO: generalize this
        var stackOrder = stackOrderDescending,
            color = this.viz.getModel('color'),
            sx = this.sx,
            sy = this.sy,
            sz = this.sz,
            x = this.model.x,
            y = this.model.y,
            viz = this.viz,
            radius = this.model.radius;
        let width, height, xrect, yrect, yi, rects;

        if (groups) {
            this.sy.domain([0, max(data, d => d.total)]).nice();
        } else {
            this.sy.domain([0, max(data, d => d[y])]).nice();
            groups = [this.model.y];
        }

        if (this.vertical) {
            xrect = x0;
            yrect = y0;
            width = sx.bandwidth;
            height = bardim;
            yi = 1;
        } else {
            xrect = y0;
            yrect = x0;
            width = bardim;
            height = sx.bandwidth;
            yi = 0;
        }
        data = stack().order(stackOrder).keys(groups)(data);
        rects = bars.data(data)
                    .enter()
                        .append('g')
                        .classed('group', true)
                        .attr('fill', d => sz(d.key))
                    .merge(bars)
                        .attr('fill', d => sz(d.key))
                        .attr('stroke', viz.modelProperty('stroke', color))
                        .attr('stroke-opacity', viz.modelProperty('strokeOpacity', color))
                        .selectAll('rect')
                        .data(stackedData);
        rects.enter()
            .append('rect')
                .attr('x', xrect)
                .attr('y', yrect)
                .attr('height', height)
                .attr('width', width)
                .attr('rx', radius)
                .attr('ry', radius)
                .on("mouseover", viz.mouseOver())
                .on("mouseout", viz.mouseOut())
            .merge(rects)
                .transition()
                .attr('x', xrect)
                .attr('y', yrect)
                .attr('height', height)
                .attr('width', width);

        function bardim (d) {
            return sy(d[1-yi]) - sy(d[yi]);
        }

        function x0 (d) {
            return sx(d.data[x]);
        }

        function y0 (d) {
            return sy(d[yi]);
        }

        function stackedData (d) {
            d.forEach(r => {
                r.key = d.key;
                r.value = r.data[d.key];
            });
            return d;
        }
    },

    grouped (bars, data, groups) {
        var color = this.viz.getModel('color'),
            sx = this.sx,
            sy = this.sy,
            sz = this.sz,
            x = this.model.x,
            viz = this.viz,
            radius = this.model.radius,
            padding = sx.paddingInner(),
            x1 = viz.getScale('band')
                    .domain(groups)
                    .paddingInner(0.5*padding);
        let width, height, xrect, rects;

        // set the value domain
        sy.domain([0, max(data, maxValue)]).nice();

        if (this.vertical) {
            x1.rangeRound([0, sx.bandwidth()]);
            xrect = gx;
            width = x1.bandwidth;
            height = gh;
        } else {
            xrect = gx;
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
                .attr("transform", d => viz.translate(xrect(d), 0))
            .merge(bars)
                .attr("transform", d => viz.translate(xrect(d), 0))
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
                .attr('rx', radius)
                .attr('ry', radius)
                .attr('height', height)
                .attr('width', width)
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', 0)
                .attr('fill', d => sz(d.key))
                .on("mouseover", viz.mouseOver())
                .on("mouseout", viz.mouseOut())
            .merge(rects)
                .transition(viz.transition('rect'))
                .attr('x', d => x1(d.key))
                .attr('y', gy)
                .attr('height', height)
                .attr('width', width)
                .attr('stroke', color.stroke)
                .attr('stroke-opacity', color.strokeOpacity)
                .attr('fill', d => sz(d.key));

        rects.exit().remove();

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

        function maxValue (d) {
            return groups.reduce((v, key) => {
                return Math.max(v, d[key]);
            }, 0);
        }
    }
};


VerticalBarChart.prototype = assign({}, barChartPrototype, {
    axis (domainX) {
        if (this.model.axisX)
            this.viz.xAxis1(this.model.axisX === true ? "bottom" : this.model.axisX, this.sx, this.box, domainX[0]);
        if (this.model.axisY)
            this.viz.yAxis1(this.model.axisY === true ? "left" : this.model.axisY, this.sy, this.box);
    }
});

HorizontalBarChart.prototype = assign({}, barChartPrototype, {
    axis (domainX) {
        if (this.model.axisX)
            this.viz.xAxis1(this.model.axisX === true ? "left" : this.model.axisX, this.sx, this.box, domainX[0]);
        if (this.model.axisY)
            this.viz.yAxis1(this.model.axisY === true ? "bottom" : this.model.axisY, this.sy, this.box);
    }
});
