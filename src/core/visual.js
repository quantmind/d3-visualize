import createVisual, {RootElement, visuals} from './base';
import warn from '../utils/warn';

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
        render: 'svg'
    },

    initialise (element, options) {
        var self = this;
        if (!element) throw new Error('HTMLElement required by visual group');
        this.root = new RootElement(element, options);
        this.select(element).classed('d3-visual', true);
        // list of layers which define the visual
        this.visuals = [];
        this.drawCount = 0;
        visuals.live.push(this);

        Object.defineProperties(this, {
            group : {
                get () {
                    return self;
                }
            }
        });
    },

    // Draw the visual
    draw() {
        if (!this.drawCount) {
            this.drawCount = 1;
            this.root.fit();
        } else {
            this.drawCount++;
            this.clear();
        }
        visuals.events.call('before-draw', undefined, this);
        this.visuals.forEach(visual => {
            visual.draw();
        });
        visuals.events.call('after-draw', undefined, this);
    },

    clear () {},

    // Add a new visual to this group
    addVisual (options) {
        options.group = this;
        var VisualClass = visuals.types[options.type];
        if (!VisualClass)
            warn(`Cannot add visual ${options.type}`);
        else {
            var viz = new VisualClass(this.element, options);
            this.visuals.push(viz);
            return viz;
        }
    },

    //
    // Resize the visual group if it needs resizing
    //
    resize (size) {
        this.root.resize(this, size);
    },

    destroy () {
        var idx = visuals.live.indexOf(this);
        if (idx > -1) {
            visuals.live.splice(idx, 1);
            this.visuals.forEach(visual => visual.destroy());
        }
    }
});
