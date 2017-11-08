//
//  Axis Plugin
//  ================
//
//  * A visual must require "d3-scale"
//
import {vizPrototype} from '../core/chart';
import extendObject from '../utils/extend-object';


vizPrototype.getScale = function (name, cfg) {
    var scale = this.getD3('scale', name)();
    return cfg ? extendObject(scale, cfg) : scale;
};
