import {map} from 'd3-collection';
import {axisTop, axisBottom, axisLeft, axisRight} from 'd3-axis';

import globalOptions from '../core/options';
import {vizPrototype} from '../core/chart';


const axisOrientation = map({
    top: axisTop,
    bottom: axisBottom,
    left: axisLeft,
    right: axisRight
});

globalOptions.xAxis = {
    location: "bottom"
};

vizPrototype.axis = function (orientation, scale) {
    return axisOrientation.get(orientation)(scale);
};
