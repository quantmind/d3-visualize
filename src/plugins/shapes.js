import {vizPrototype} from '../core/chart';


vizPrototype.getSymbol = function (name) {
    return this.$.symbol().type(this.getD3('symbol', name));
};


vizPrototype.getCurve = function (name) {
    return this.getD3('curve', name);
};


vizPrototype.getStack = function () {
    var model = this.getModel();
    if (model.stack) {
        var s = this.$.stack();
        if (model.stackOrder) s.order(this.getD3('stack', model.stackOrder));
        if (model.stackOffset) s.offset(this.getD3('stack', model.stackOffset));
        return s;
    }
};
