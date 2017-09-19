import {select} from 'd3-selection';

import round from './round';


const WIDTH = 400;
const HEIGHT = '75%';


// Internal function for evaluating paper dom size
export function getSize (element, options) {
    var size = {
        width: options.width,
        height: options.height
    };

    if (!size.width) {
        size.width = getWidth(element);
        if (size.width)
            size.widthElement = getWidthElement(element);
        else
            size.width = WIDTH;
    }

    if (!size.height) {
        size.height = getHeight(element);
        if (size.height)
            size.heightElement = getHeightElement(element);
        else
            size.height = HEIGHT;
    }

    // Allow to specify height as a percentage of width
    if (typeof(size.height) === "string" && size.height.indexOf('%') === size.height.length-1) {
        size.heightPercentage = 0.01*parseFloat(size.height);
        size.height = round(size.heightPercentage*size.width);
    }

    return size;
}


export function getWidth (element) {
    var el = getParentElementRect(element, 'width');
    if (el) return elementWidth(el);
}


export function getHeight (element) {
    var el = getParentElementRect(element, 'width');
    if (el) return elementHeight(el);
}


export function getWidthElement (element) {
    return getParentElementRect(element, 'width');
}


export function getHeightElement (element) {
    return getParentElementRect(element, 'height');
}


function elementWidth (el) {
    var w = el.getBoundingClientRect()['width'],
        s = select(el),
        left = padding(s.style('padding-left')),
        right = padding(s.style('padding-right'));
    return w - left - right;
}


function elementHeight (el) {
    var w = el.getBoundingClientRect()['height'],
        s = select(el),
        top = padding(s.style('padding-top')),
        bottom = padding(s.style('padding-bottom'));
    return w - top - bottom;
}


function getParentElementRect (element, key) {
    let parent = element.node ? element.node() : element,
        v;
    while (parent && parent.tagName !== 'BODY') {
        v = parent.getBoundingClientRect()[key];
        if (v)
            return parent;
        parent = parent.parentNode;
    }
}


function padding (value) {
    if (value && value.substring(value.length-2) == 'px')
        return +value.substring(0, value.length-2);
    return 0;
}


export function boundingBox (size) {
    var w = size.widthElement ? getWidth(size.widthElement) : size.width,
        h;
    if (size.heightPercentage)
        h = round(w*size.heightPercentage, 0);
    else
        h = size.heightElement ? getHeight(size.heightElement) : size.height;
    if (size.minHeight)
        h = Math.max(h, size.minHeight);
    return [round(w), round(h)];
}
