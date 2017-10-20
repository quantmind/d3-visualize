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

    group (cname, transform) {
        return this.childGroup(this.sel, cname, transform);
    },

    childGroup (g, cname, transform) {
        if (!cname) cname = 'main';
        var ge = g.selectAll(`.${cname}`)
                    .data([0])
                    .enter()
                    .append('g').classed(cname, true);
        // TODO, not sure we need this anymore - we gave applyTransform
        if (transform)
            ge.attr('transform', transform)
                .merge()
                .attr('transform', transform);
        return g.select(`.${cname}`);
    },

    dim (value) {
        return value;
    }
};


export const Svg = createPaper('svg', {

    initialise (visual) {
        var svg = visual.paperElement.select(`svg#${visual.model.uid}`);
        if (!svg.size())
            svg = visual.paperElement.append('svg')
                .attr('id', visual.model.uid)
                .classed(visual.visualType, true)
                .style('position', 'absolute');
        return svg.node();
    }
});


export const Div = createPaper('div', {

    initialise (visual) {
        var div = visual.paperElement.select(`div#${visual.model.uid}`);
        if (!div.size())
            div = visual.paperElement.append('div')
                    .attr('id', visual.model.uid)
                    .classed(visual.visualType, true);
                    //.style('position', 'absolute');
        return div.node();
    },

    childGroup (g, cname) {
        if (!cname) cname = 'main';
        g.selectAll(`.${cname}`)
            .data([0]).enter()
            .append('div').classed(cname, true);
        return g.select(`.${cname}`);
    },
});
