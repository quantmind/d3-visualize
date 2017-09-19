import * as d3_shape from 'd3-shape';

import createChart from '../core/chart';
import warn from '../utils/warn';


//
//  Line Chart
//  =============
//
//  The barchart is one of the most flexible visuals.
//  It can be used to display label data as well as
//  timeserie data. It can display absulte values as
//  proportional data via vertical staking and normalization
export default createChart('linechart', {

    options: {
        lineWidth: 1,
        colorOpacity: 1,
        curve: 'cardinalOpen'
    },

    doDraw () {
        var data = this.series,
            aesthetics = this.aesthetics,
            path = this.plot.path(this).data([data]),
            x = this.scaled(this.mapping.x, this.plot, data),
            y = this.scaled(this.mapping.y, this.plot, data),
            line = d3_shape.line().x(x).y(y).curve(curve(this, aesthetics.curve)),
            width = this.plot.dim(aesthetics.lineWidth),
            merge = this.plot.transition('update');

        path
            .enter()
                .append('path')
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', aesthetics.color)
                .attr('stroke-opacity', 0)
                .attr('stroke-width', width)
            .merge(path)
                .transition(merge)
                .attr('stroke', aesthetics.color)
                .attr('stroke-opacity', aesthetics.colorOpacity)
                .attr('stroke-width', width)
                .attr('d', line);

        path
            .exit()
            .remove();
    }
});


export function curve (layer, name) {
    var obj = d3_shape[curveName(name)];
    if (!obj) {
        warn(`Could not locate curve type "${name}"`);
        name = curveName(layer.defaults().curveName);
        obj = d3_shape[name];
    }
    return obj;
}


function curveName (name) {
    if (name.substring(0, 5) !== 'curve')
        name = 'curve' + name[0].toUpperCase() + name.substring(1);
    return name;
}
