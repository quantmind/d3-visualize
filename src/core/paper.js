import {assign} from 'd3-let';
import {viewBase} from 'd3-view';

import {visuals} from './base';


export default function createPaper (type, proto) {

    function Paper (viz, uid) {
        var element = this.initialise(viz, uid);
        Object.defineProperties(this, {
            element: {
                get () {
                    return element;
                }
            },
            sel: {
                get () {
                    return this.select(element);
                }
            },
            paperType: {
                get () {
                    return type;
                }
            }
        });
    }

    Paper.prototype = assign({}, viewBase, paperPrototype, proto);

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

    initialise (visual, uid) {
        if (!uid) visual.model.uid;
        var svg = visual.paperElement.select(`svg#${uid}`);
        if (!svg.size())
            svg = visual.paperElement.append('svg')
                .attr('id', uid)
                .classed(visual.visualType, true)
                .style('position', 'absolute');
        return svg.node();
    }
});


export const Div = createPaper('div', {

    initialise (viz) {
        var uid = viz.model.uid,
            visual = viz.visualParent;
        var div = visual.paperElement.select(`div#${uid}`);
        if (!div.size())
            div = visual.paperElement.append('div')
                    .attr('id', uid)
                    .classed(visual.visualType, true)
                    .style('position', 'absolute');
        return div.node();
    },

    size (box) {
        this.sel
            .style('width', `${box.width}px`)
            .style('height', `${box.height}px`);
        return this;
    },

    childGroup (g, cname) {
        if (!cname) cname = 'main';
        g.selectAll(`.${cname}`)
            .data([0]).enter()
            .append('div').classed(cname, true);
        return g.select(`.${cname}`);
    },
});
