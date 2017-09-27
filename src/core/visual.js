import {pop, inBrowser} from 'd3-let';
import {select} from 'd3-selection';
import {viewDebug} from 'd3-view';

import createVisual, {visuals} from './base';
import warn from '../utils/warn';
import {getSize, boundingBox} from '../utils/size';

//
//  Visual
//  =============
//
//  A Visual is a a container of visual layers and it is
//  associated with an HTML element
//
//  Usually a Visual contains one layer only, however it is possible to
//  have more than one by combining several layers together. Importantly,
//  layers in one visual generate HTMLElements which are children of the visual
//  element and inherit both the width and height.
//
//  A visual register itself with the visuals.live array
//
export default createVisual('visual', {

    options: {
        render: 'svg',
        // width set by the parent element
        width: null,
        // height set as percentage of width
        height: '70%'
    },

    initialise (element) {
        if (!element) throw new Error('HTMLElement required by visual group');
        if (this.visualParent && this.visualParent.visualType !== 'container')
            throw new Error('Visual parent can be a container only');

        Object.defineProperties(this, {
            element : {
                get () {
                    return element;
                }
            },
            sel: {
                get () {
                    return select(element);
                }
            },
            size: {
                get () {
                    return [this.width, this.height];
                }
            }
        });

        this.sel.classed('d3-visual', true);
        // list of layers which define the visual
        this.layers = [];
        this.drawCount = 0;
        visuals.live.push(this);
        element.__visual__ = this;
    },

    toString () {
        return `visual ${this.model.uid}`;
    },

    // Draw the visual
    draw() {
        if (!this.drawCount) {
            this.drawCount = 1;
            this.fit();
        } else {
            this.drawCount++;
            this.clear();
        }
        visuals.events.call('before-draw', undefined, this);
        this.layers.forEach(visual => {
            visual.draw();
        });
        visuals.events.call('after-draw', undefined, this);
    },

    clear () {},

    // Add a new visual to this group
    addVisual (options) {
        var type = pop(options, 'type');
        var VisualClass = visuals.types[type];
        if (!VisualClass)
            warn(`Cannot add visual ${options.type}`);
        else
            return new VisualClass(this.element, options, this);
    },
    // Fit the root element to the size of the parent element
    fit () {
        var size = getSize(this.element.parentNode, this.getModel('visual'));
        this.width = size.width;
        this.height = size.height;
        this.sel.style('width', this.width + 'px').style('height', this.height + 'px');
    },

    resize (size) {
        if (!size) size = boundingBox(this);
        var currentSize = this.size;

        if (currentSize[0] !== size[0] || currentSize[1] !== size[1]) {
            viewDebug(`Resizing "${this.toString()}"`);
            this.width = size[0];
            this.height = size[1];
            this.draw();
        }
    },

    destroy () {
        var idx = visuals.live.indexOf(this);
        if (idx > -1) visuals.live.splice(idx, 1);
    }
});


if (inBrowser) {
    // DOM observer
    // Check for changes in the DOM that leads to visual actions
    const observer = new MutationObserver(visualManager);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

//
//  Clears visualisation going out of scope
function visualManager (records) {
    records.forEach(record => {
        var nodes = record.removedNodes;
        if (!nodes || !nodes.length) return;  // phantomJs hack
        nodes.forEach(node => {
            if (node.nodeName !== '#text') {
                if (!node.__visual__)
                    select(node).selectAll('.d3-visual').each(destroy);
                else
                    destroy.call(node);
            }
        });
    });
}


function destroy () {
    var viz = this.__visual__;
    if (viz) {
        viz.destroy();
        viewDebug(`Removed "${viz.toString()}" from DOM, ${visuals.live.length} live visuals left`);
    }
    else warn('d3-visual without __visual__ object');
}
