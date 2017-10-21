import {
    symbol, stack,
    symbolCircle, symbolSquare, symbolStar,
    stackOrderAscending, stackOrderDescending, stackOrderInsideOut,
    stackOrderNone, stackOrderReverse,
    stackOffsetExpand, stackOffsetDiverging, stackOffsetNone,
    stackOffsetSilhouette, stackOffsetWiggle
} from 'd3-shape';
import {map} from 'd3-collection';

import {vizPrototype} from '../core/chart';

const symbols = map({
    circle: symbolCircle,
    square: symbolSquare,
    star: symbolStar
});

const stackOrders = map({
    ascending: stackOrderAscending,
    descending: stackOrderDescending,
    insideout: stackOrderInsideOut,
    none: stackOrderNone,
    reverse: stackOrderReverse
});

const stackOffsets = map({
    expand: stackOffsetExpand,
    diverging: stackOffsetDiverging,
    none: stackOffsetNone,
    silhouette: stackOffsetSilhouette,
    wiggle: stackOffsetWiggle
});


vizPrototype.getSymbol = function (name) {
    var s = symbols.get(name);
    return symbol().type(s);
};


vizPrototype.getStack = function () {
    var model = this.getModel();
    if (model.stack) {
        var s = stack();
        if (model.stackOrder) s.order(stackOrders.get(model.stackOrder));
        if (model.stackOffset) s.offset(stackOffsets.get(model.stackOffset));
        return s;
    }
    return null;
};
