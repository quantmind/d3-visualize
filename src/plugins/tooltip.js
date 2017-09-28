import {map} from 'd3-collection';

import globalOptions from '../core/options';
import constant from '../utils/constant';


globalOptions.tooltip = {
    location: "top-right",
    orient: "vertical",
    offsetX: 10,
    offsetY: 10
};


const locations = map({
    top,
    bottom,
    right,
    left,
    'top-left': topLeft,
    'top-right': topRight,
    'bottom-left': bottomLeft,
    'bottom-right': bottomRight
});


export default function () {
    var direction = constant('top');

    function tip() {
    }

    tip.show = function () {
        var args = Array.prototype.slice.call(arguments),
            dir  = direction.apply(this, args),
            coords = locations.get(dir).apply(this);
        return coords;
    };
}


function top (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: options.offsetY
    };
}


function bottom (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: box.height - bb.height - options.offsetY
    };
}


function right (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: options.offsetY
    };
}


function left (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: options.offsetY
    };
}


function topLeft (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: options.offsetY
    };
}


function topRight (bb, box, options) {
    return {
        x: box.width - bb.width - options.offsetX,
        y: options.offsetY
    };
}


function bottomLeft (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: box.height - bb.height - options.offsetY
    };
}


function bottomRight (bb, box, options) {
    return {
        x: box.total.left + (box.innerWidth - bb.width)/2,
        y: box.height - bb.height - options.offsetY
    };
}
