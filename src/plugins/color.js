import {map} from 'd3-collection';
import {range} from 'd3-array';
import {color} from 'd3-color';
import {isObject} from 'd3-let';
import {
    scaleSequential,
    interpolateViridis, interpolateInferno, interpolateMagma,
    interpolatePlasma, interpolateWarm, interpolateCool,
    interpolateRainbow, interpolateCubehelixDefault
} from 'd3-scale';
import globalOptions from '../core/options';
import {vizPrototype} from '../core/chart';

export const colorScales = map();


globalOptions.color = {
    scale: 'cool',
    // Minumim number of colors in a sequantial color scale
    // This helps in keeping a consistent palette when few colors are used
    scaleMinPoints: 6,
    // An offset in the color scale, useful for combined visuals
    scaleOffset: 0,
    stroke: '#333',
    strokeOpacity: 1,
    fillOpacity: 1,
};

colorScales.set('viridis', () =>  scaleSequential(interpolateViridis));
colorScales.set('inferno', () =>  scaleSequential(interpolateInferno));
colorScales.set('magma', () =>  scaleSequential(interpolateMagma));
colorScales.set('plasma', () =>  scaleSequential(interpolatePlasma));
colorScales.set('warm', () =>  scaleSequential(interpolateWarm));
colorScales.set('cool', () =>  scaleSequential(interpolateCool));
colorScales.set('rainbow', () =>  scaleSequential(interpolateRainbow));
colorScales.set('cubehelix', () =>  scaleSequential(interpolateCubehelixDefault));

//
//  Color scale method
//  ==========================
vizPrototype.colors = function (n) {
    var color = this.getModel('color'),
        scaleDef = colorScales.get(color.scale);

    if (!scaleDef) throw new Error(`Unknown scale ${color.scale}`);
    if (!isObject(scaleDef)) scaleDef = {scale: scaleDef};
    if (scaleDef.minPoints === undefined) scaleDef.minPoints = color.scaleMinPoints;

    var offset = color.scaleOffset,
        npoints = n + offset,
        points = Math.max(npoints, scaleDef.minPoints),
        domain = scaleDef.reversed ? [points-1, 0] : [0, points-1],
        scale = scaleDef.scale().domain(domain);
    return range(offset, Math.min(npoints, points)).map(v => scale(v));
};

//
//  Linear Gradient method
//  ==========================
//
//  Create a monocromatic linear gradient in the visualization box,
//  either horizontal or vertical
vizPrototype.linearGradient = function (col, box, orientation, gid) {
    var paper = this.paper().sel,
        defs = paper.select('defs');
    if (!defs.node()) defs = paper.append('defs');
    const
        grad = defs.selectAll(`#${gid}`).data([0]),
        colto = color(col);

    colto.opacity = 0.1;

    grad.enter()
        .append('linearGradient')
        .attr('id', gid)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', orientation === 'vertical' ? '0%' : '100%')
        .attr('y2', orientation === 'vertical' ? '100%' : '0%');

    var stops = defs.select(`#${gid}`)
                    .selectAll('stop')
                    .data([{offset: '0%', color: col}, {offset: '100%', color: colto}]);

    stops.enter()
            .append('stop')
        .merge(stops)
            .attr('offset', d => d.offset)
            .attr('stop-color', d => d.color);

    return `url(#${gid})`;
};
