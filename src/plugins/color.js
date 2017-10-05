import {map} from 'd3-collection';
import {range} from 'd3-array';
import {isObject} from 'd3-let';
import {viewUid} from 'd3-view';
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
vizPrototype.linearGradient = function (box, orientation) {
    var gid = viewUid();
    var defs = this.paper.select('defs');
    if (!defs.node()) defs = this.paper.append(defs);
    const grad = defs
                    .append('linearGradient')
                    .attr('id', gid)
                    .attr('x1', '0%')
                    .attr('y1', '0%');
    if (orientation === 'vertical') {
        grad.attr('x2', '0%').attr('y2', '100%');
    } else {
        grad.attr('x2', '100%').attr('y2', '0%');
    }
};
