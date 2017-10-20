import {pop, inBrowser} from 'd3-let';
import {select} from 'd3-selection';
import {viewDebug} from 'd3-view';

import createVisual, {visuals} from './base';
import warn from '../utils/warn';
import {getSize} from '../utils/size';

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
        height: '70%',
        // heightElement - selector for an element from wich to obtain height
        heightElement: null
    },

    initialise (element) {
        if (!element) throw new Error('HTMLElement required by visual group');
        if (this.visualParent && this.visualParent.visualType !== 'container')
            throw new Error('Visual parent can be a container only');
        if (!this.select(element).select('.paper').node())
            this.select(element).append('div').classed('paper', true);

        Object.defineProperties(this, {
            element : {
                get () {
                    return element;
                }
            },
            paperElement : {
                get () {
                    return this.sel.select('.paper');
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
        if (this.visualParent) this.visualParent.live.push(this);
    },

    activate () {
        this.layers.forEach(layer => layer.activate());
    },

    deactivate () {
        this.layers.forEach(layer => layer.deactivate());
    },

    // Draw the visual
    draw (fetchData) {
        if (this.drawing) {
            warn(`${this.toString()} already drawing`);
            return this.drawing;
        }
        else if (!this.drawCount) {
            this.drawCount = 1;
            this.fit();
        } else {
            this.drawCount++;
            this.clear();
        }
        var self = this;
        visuals.events.call('before-draw', undefined, this);
        return Promise.all(this.layers.map(visual => {
            if (visual.active) {
                visual.paper().size(visual.boundingBox(true));
                return visual.redraw(fetchData);
            }
        })).then(() => {
            delete self.drawing;
            visuals.events.call('after-draw', undefined, self);
        }, err => {
            delete self.drawing;
            warn(`Could not draw ${self.toString()}: ${err}`);
        });
    },

    clear () {},

    // Add a new visual to this group
    addVisual (options) {
        var type = pop(options, 'type');
        var VisualClass = visuals.types[type];
        if (!VisualClass)
            warn(`Cannot add visual "${type}", not available`);
        else
            return new VisualClass(this.element, options, this);
    },
    //
    // Fit the root element to the size of the parent element
    fit () {
        this.resize(null, true);
    },

    // resize the chart
    resize (size, fit) {
        if (!size) size = getSize(this.element.parentNode || this.element, this.getModel());
        var currentSize = this.size;

        if (fit || (currentSize[0] !== size.width || currentSize[1] !== size.height)) {
            if (!fit) viewDebug(`Resizing "${this.toString()}"`);
            this.width = size.width;
            this.height = size.height;
            // this.paper.style('width', this.width + 'px').style('height', this.height + 'px');
            this.paperElement.style('height', this.height + 'px');
            // if we are not just fitting draw the visual without fetching data!!
            if (!fit) this.draw(false);
        }
    },

    paper () {
        var paper = this.__paper,
            render = this.getModel().render;
        if (paper && paper.paperType === render) return paper;
        var PaperType = visuals.papers[render];
        if (!PaperType) throw new Error(`Unknown paper ${render}`);
        paper = new PaperType(this);
        this.__paper = paper;
        return paper;
    },

    getPaperGroup (gname) {
        return this.paper().group(gname);
    },

    destroy () {
        this.pop(this.visualParent);
        this.pop(visuals);
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
