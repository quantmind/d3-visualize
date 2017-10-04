import {map} from 'd3-collection';
import {range} from 'd3-array';
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
    scaleMinPoints: 6,
    stroke: '#333',
    strokeOpacity: 1,
    fillOpacity: 1
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

    var points = Math.max(n, scaleDef.minPoints),
        domain = scaleDef.reversed ? [points-1, 0] : [0, points-1],
        scale = scaleDef.scale().domain(domain);
    return range(0, Math.min(n, points)).map(v => scale(v));
};
