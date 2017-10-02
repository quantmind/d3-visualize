import assign from 'object-assign';
import {select} from 'd3-selection';

import {visuals} from './base';


export default function createPaper (type, proto) {

    function Paper (viz) {
        var element = this.initialise(viz);
        Object.defineProperties(this, {
            element: {
                get () {
                    return element;
                }
            },
            sel: {
                get () {
                    return select(element);
                }
            },
            paperType: {
                get () {
                    return type;
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
    size (box) {
        this.sel
            .attr('width', box.width)
            .attr('height', box.height);
        return this;
    },

    group (cname) {
        if (!cname) cname = 'main';
        var sel = this.sel;
        sel
            .selectAll(`.${cname}`)
            .data([0]).enter()
            .append('g').classed(cname, true);
        return sel.select(`.${cname}`);
    },

    dim (value) {
        return value;
    }
};


export const Svg = createPaper('svg', {

    initialise (viz) {
        var svg = viz.visualParent.paper.append('svg')
            .attr('id', viz.model.uid)
            .classed(viz.visualType, true);
        return svg.node();
    }
});
