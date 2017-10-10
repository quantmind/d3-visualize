import {symbol, symbolCircle, symbolSquare, symbolStar} from 'd3-shape';
import {map} from 'd3-collection';

import {vizPrototype} from '../core/chart';

const symbols = map({
    circle: symbolCircle,
    square: symbolSquare,
    star: symbolStar
});


vizPrototype.getSymbol = function (name) {
    var s = symbols.get(name);
    return symbol().type(s);
};
