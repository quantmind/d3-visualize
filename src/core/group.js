import createVisual, {RootElement, liveVisuals} from './base';
import Visual from './visual';
import globalOptions from './options';


globalOptions.visualGroup = {
    render: 'svg'
};

//
//  VisualGroup
//  =============
//
//  A VisualGroup is a specialized Visual associated with an HTML element
//  and containing one or more visuals
//
//  Usually a VisualGroup contains one visual only, however it is possible to
//  have more than one by combining several visuals together. Importantly,
//  visuals in one group generate HTMLElement which are children of the group
//  element and inherit both the width and height.
//
//  A group register itself with the liveVisuals array
//
export default createVisual('group', {

    initialise (options, element) {
        var self = this;
        if (!element) throw new Error('HTMLElement required by visual group');
        this.root = new RootElement(element, options);
        liveVisuals.push(this);

        Object.defineProperties(this, {
            group : {
                get () {
                    return self;
                }
            }
        });
    },

    // Add a new visual to this group
    addVisual (options) {
        options.group = this;
        this.visuals.push(new Visual(options));
    },

    //
    // Resize the visual group if it needs resizing
    //
    resize (size) {
        this.root.resize(this, size);
    },

    destroy () {
        var idx = liveVisuals.indexOf(this);
        if (idx > -1) {
            liveVisuals.splice(idx, 1);
            this.visuals.forEach(visual => visual.destroy());
        }
    }
});
