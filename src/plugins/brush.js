import {vizPrototype} from '../core/chart';


vizPrototype.brushX = function () {
    return this.$.brushX();
};

vizPrototype.brushY = function () {
    return this.$.brushY();
};

vizPrototype.brush = function () {
    return this.$.brush();
};
