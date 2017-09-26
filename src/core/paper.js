import assign from 'object-assign';
import {select} from 'd3-selection';

import {visuals} from './base';


export default function createPaper (type, proto) {

    function Paper (viz) {
        var element = this.initialise(viz);
        Object.defineProperties(this, {
            element : {
                get () {
                    return element;
                }
            },
            sel : {
                get () {
                    return select(element);
                }
            }
        });
    }

    Paper.prototype = assign({}, paperPrototype, proto);

    visuals.papers[type] = Paper;
    return Paper;
}


const paperPrototype = {

    initialise () {},
    transition () {},
    dim (value) {
        return value;
    }
};


export const Svg = createPaper('svg', {

    initialise (viz) {
        var svg = viz.visualParent.sel.append('svg')
            .attr('id', viz.model.uid)
            .classed(viz.visualType, true);
        return svg.node();
    }
});
