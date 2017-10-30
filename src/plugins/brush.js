import {brushX, brushY, brush} from 'd3-brush';


import {vizPrototype} from '../core/chart';


vizPrototype.brushX = function () {
    return brushX();
};

vizPrototype.brushY = function () {
    return brushY();
};

vizPrototype.brush = function () {
    return brush();
};
