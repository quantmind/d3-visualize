import {map} from 'd3-collection';
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
    scale: 'cool'
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
vizPrototype.colorScale = function () {
    var color = this.getModel('color'),
        scale = colorScales.get(color.scale);
    if (!scale) throw new Error(`Unknown scale ${color.scale}`);
    return scale();
};
