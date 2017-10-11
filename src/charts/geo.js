import {extent, range} from 'd3-array';
import {map} from 'd3-collection';

import accessor from '../utils/accessor';
import niceRange from '../utils/nicerange';
import createChart from '../core/chart';
import {lineDrawing} from './line';
//
//  GeoChart
//  =============
//
//  A chart displaying a geographical map
export default createChart('geochart', {

    options: {
        // the geometry needed it by this geo chart
        geometry: null
    },

    doDraw (frame) {
        var box = this.boundingBox();
    }
});
