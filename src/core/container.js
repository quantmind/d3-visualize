import createVisual, {visuals} from './base';


export default createVisual('container', {

    initialise () {
        this.live = [];
        if (this.visualParent) this.visualParent.live.push(this);
    },

    draw() {
        visuals.events.call('before-draw', undefined, this);
        this.live.forEach(visual => {
            visual.draw();
        });
        visuals.events.call('after-draw', undefined, this);
    },

    destroy () {
        this.pop(this.visualParent);
    }
});
