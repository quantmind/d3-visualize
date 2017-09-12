import assign from 'object-assign';
import {select} from 'd3-canvas-transition';

import globalOptions from './options';


globalOptions.paper = {
    render: 'svg'
};

let paperCount = 0;

//
//  Paper
//  =============
//
//  A paper is associated with HTML element and is a container of layers
//  Each layer in a paper draw a visual.
//
//  Usually a paper contains only one layer and therefore one visual
//
function Paper (element, options) {
    options = assign({}, globalOptions.paper, options);
    element = select(getElement(element));
    ++paperCount;

    element
            .append('div')
            .attr('id', `d3p${paperCount}`)
            .classed('d3-paper', true)
            .classed(`d3-paper-${options.render}`, true);

    this.name = options.name || `paper${paperCount}`;
}


Paper.prototype = {

};


function getElement (element) {
    if (!element) {
        element = document.createElement('div');
    } if (isFunction(element.node))
        element = element.node();
    return element;
}
