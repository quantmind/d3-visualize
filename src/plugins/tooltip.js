import {map} from 'd3-collection';
import {inBrowser} from 'd3-let';
import {select} from 'd3-selection';

import {visuals} from '../core/base';
import {vizPrototype} from '../core/chart';
import functor from '../utils/functor';
import noop from '../utils/identity';
import {mouseStrategies} from './mouse';


visuals.options.tooltip = {
    location: "top",
    offset: [0, 0],
    html: ""
};


if (inBrowser) vizPrototype.tooltip = tooltip();
else vizPrototype.tooltip = noop;


mouseStrategies.set('tooltip', function () {

    function tooltip (viz, sel, d, i) {
        var html = viz.tooltipHtml(sel, d, i);
        if (html) {
            var model = viz.getModel('tooltip');
            viz.tooltip.location(model.location).offset(model.offset).html(html).show(sel.node());
        }
    }

    tooltip.out = function (viz) {
        viz.tooltip.hide();
    };

    return tooltip;
}());


vizPrototype.tooltipHtml = function (sel, d, i) {
    var model = this.getModel('tooltip');
    if (model.html)
        return this.dataStore.eval(model.html, {
            d: d,
            index: i,
            model: this.getModel()
        });
};


function tooltip () {

    var location = functor('top'),
        offset = functor([0, 0]),
        html = functor(' '),
        node = null,
        point = null;

    const locationCallbacks = map({
        top,
        bottom,
        right,
        left,
        'top-left': topLeft,
        'top-right': topRight,
        'bottom-left': bottomLeft,
        'bottom-right': bottomRight
    });

    const locations = locationCallbacks.keys();

    function selectNode() {
        if (node === null) {
            node = select(document.body)
                        .append('div')
                        .classed('d3-tooltip', true)
                        .style('position', 'absolute')
                        .style('top', 0)
                        .style('opacity', 0)
                        .style('pointer-events', 'none')
                        .style('box-sizing', 'border-box')
                        .node();
            point = select(document.body)
                        .append('svg')
                        .style('opacity', 0)
                        .style('pointer-events', 'none')
                        .node().createSVGPoint();
        }
        return select(node);
    }

    function tooltip () {
    }

    tooltip.show = function (target) {
        var args = Array.prototype.slice.call(arguments),
            snode = selectNode(),
            content = html.apply(this, args) || '',
            poffset = offset.apply(this, args),
            dir = location.apply(this, args),
            scrollTop  = document.documentElement.scrollTop || document.body.scrollTop,
            scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
            coords;

        snode.html(content).style('opacity', 1).style('pointer-events', 'all');

        let i = locations.length;
        while (i--) snode.classed(locations[i], false);
        coords = locationCallbacks.get(dir).call(this, target);
        snode.classed(dir, true)
            .style('top', (coords.top + poffset[0]) + scrollTop + 'px')
            .style('left', (coords.left + poffset[1]) + scrollLeft + 'px');

        return tooltip;
    };

    tooltip.hide = function () {
        selectNode().style('opacity', 0).style('pointer-events', 'none');
        return tooltip;
    };

    // Returns tip or location
    tooltip.location = function (v) {
        if (!arguments.length) return location;
        location = v === null ? v : functor(v);
        return tooltip;
    };

    tooltip.html = function(v) {
        if (!arguments.length) return html;
        html = v === null ? v : functor(v);
        return tooltip;
    };

    tooltip.offset = function(v) {
        if (!arguments.length) return offset;
        offset = v == null ? v : functor(v);
        return tooltip;
    };

    return tooltip;



    function top (target) {
        var bbox = getScreenBBox(target);
        return {
            top:  bbox.n.y - node.offsetHeight,
            left: bbox.n.x - node.offsetWidth / 2
        };
    }


    function bottom (bb, box, options) {
        return {
            x: box.total.left + (box.innerWidth - bb.width)/2,
            y: box.height - bb.height - options.offsetY
        };
    }


    function right (target) {
        var bbox = getScreenBBox(target);
        return {
            top:  bbox.e.y - node.offsetHeight / 2,
            left: bbox.e.x
        };
    }


    function left (bb, box, options) {
        return {
            x: box.total.left + (box.innerWidth - bb.width)/2,
            y: options.offsetY
        };
    }


    function topLeft (bb, box, options) {
        return {
            x: box.total.left + (box.innerWidth - bb.width)/2,
            y: options.offsetY
        };
    }


    function topRight (bb, box, options) {
        return {
            x: box.width - bb.width - options.offsetX,
            y: options.offsetY
        };
    }


    function bottomLeft (bb, box, options) {
        return {
            x: box.total.left + (box.innerWidth - bb.width)/2,
            y: box.height - bb.height - options.offsetY
        };
    }


    function bottomRight (bb, box, options) {
        return {
            x: box.total.left + (box.innerWidth - bb.width)/2,
            y: box.height - bb.height - options.offsetY
        };
    }


    // Private - gets the screen coordinates of a shape
    //
    // Given a shape on the screen, will return an SVGPoint for the locations
    // n(north), s(south), e(east), w(west), ne(northeast), se(southeast),
    // nw(northwest), sw(southwest).
    //
    //    +-+-+
    //    |   |
    //    +   +
    //    |   |
    //    +-+-+
    //
    // Returns an Object {n, s, e, w, nw, sw, ne, se}
    function getScreenBBox (targetel) {

        while (targetel.getScreenCTM == null && targetel.parentNode == null) {
            targetel = targetel.parentNode;
        }

        var bbox = {},
            matrix = targetel.getScreenCTM(),
            tbbox = targetel.getBBox(),
            width = tbbox.width,
            height = tbbox.height,
            x = tbbox.x,
            y = tbbox.y;

        point.x = x;
        point.y = y;
        bbox.nw = point.matrixTransform(matrix);
        point.x += width;
        bbox.ne = point.matrixTransform(matrix);
        point.y += height;
        bbox.se = point.matrixTransform(matrix);
        point.x -= width;
        bbox.sw = point.matrixTransform(matrix);
        point.y -= height / 2;
        bbox.w = point.matrixTransform(matrix);
        point.x += width;
        bbox.e = point.matrixTransform(matrix);
        point.x -= width / 2;
        point.y -= height / 2;
        bbox.n = point.matrixTransform(matrix);
        point.y += height;
        bbox.s = point.matrixTransform(matrix);

        return bbox;
    }
}
