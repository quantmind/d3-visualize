import createVisual, {visuals} from './base';
import warn from '../utils/warn';


export default createVisual('container', {

    initialise () {
        this.live = [];
        if (this.visualParent) this.visualParent.live.push(this);
    },

    draw() {
        if (this.drawing) {
            warn(`${this.toString()} already drawing`);
            return this.drawing;
        }
        var self = this;
        visuals.events.call('before-draw', undefined, self);
        return Promise.all(this.live.map(visual => visual.redraw())).then(() => {
            delete self.drawing;
            visuals.events.call('after-draw', undefined, self);
        });
    },

    destroy () {
        this.pop(this.visualParent);
    }
});
