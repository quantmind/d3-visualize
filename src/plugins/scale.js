//
//  Axis Plugin
//  ================
//
//  * A visual must require "d3-scale"
//
import {isString} from 'd3-let';
import {vizPrototype} from '../core/chart';
import extendObject from '../utils/extend-object';


vizPrototype.getScale = function (cfg) {
    if (isString(cfg)) cfg = {type: cfg};
    var scale = this.getD3('scale', cfg.type)();
    return extendObject(scale, cfg);
};
