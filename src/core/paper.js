import assign from 'object-assign';
import {visuals} from './base';


export default function createPaper (type, proto) {

    function Paper (viz) {
        this.initialise(viz);
    }

    Paper.prototype = assign({}, paperPrototype, proto);

    visuals.papers[type] = Paper;
    return Paper;
}


const paperPrototype = {

    initialise () {},
    transition () {}
};


export const Svg = createPaper('svg', {

    initialise (viz) {
        var svg = viz.visual.sel.append('svg').attr('id', viz.model.uid);
        this.element = svg.node();
    }
});
