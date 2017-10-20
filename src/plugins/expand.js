//
//
//  Expand viusals layers and visuals
//  =======================================
//
import {visuals} from '../core/base';
import {locations} from './legend';
import {KEYS} from './margin';

visuals.options.expand = {
    location: 'top-right',
    expandText: 'expand',
    collapseText: 'collapse',
    height: 15,
    width: 15,
    radius: 3,
    offset: [0, 0],
    stroke: '#adadad',
    fill: '#fff',
    fillOver: '#e6e6e6',
    textColor: '#111'
};



visuals.events.on('after-draw.expand', viz => {
    var visual = viz.visualParent;
    if (!viz.isViz || visual.layers.length <= 1) return;

    var model = viz.getModel('expand');
    if (!model.location) return;
    var font = viz.getModel('font'),
        box = viz.boundingBox(),
        button = viz.group('expand'),
        node = button.node(),
        size = Math.floor(0.8*Math.min(model.width, model.height)),
        buttonText = viz.__expanded ? model.collapseText : model.expandText,
        firstPass = false;

    if (!button.select('rect').size()) {
        firstPass = true;
        button.attr('cursor', 'pointer')
                .on("mouseover", mouseOver)
                .on("mouseout", mouseOut);

        button.append('rect')
            .classed('button', true)
            .attr('x', 0)
            .attr('y', 0)
            .attr('rx', model.radius)
            .attr('ry', model.radius)
            .attr('width', model.width)
            .attr('height', model.height)
            .attr('stroke', model.stroke)
            .attr('fill', model.fill)
            .attr('cursor', 'pointer');

        button
            .append('text')
            .attr('x', model.width/2)
            .attr('y', model.height/2)
            .attr('fill', model.textColor)
            .attr('font-family', model.fontFamily || font.family)
            .attr('text-anchor', "middle")
            .attr('alignment-baseline', "middle")
            .attr('font-size', size);

        button.append('rect')
            .classed('placeholder', true)
            .attr('x', 0)
            .attr('y', 0)
            .attr('rx', model.radius)
            .attr('ry', model.radius)
            .attr('width', model.width)
            .attr('height', model.height)
            .attr('stroke', 'none')
            .attr('fill', 'transparent')
            .on("click", click);
    }

    button.select('text').text(() => buttonText);
    var bb = locations.get(model.location).call(viz, node.getBBox(), box, model);
    if (!firstPass) button = button.transition(viz.transition('expand'));
    button.attr('transform', viz.translate(bb.x, bb.y));

    function mouseOver() {
        viz.select(this).select('rect.button')
            .attr('fill', model.fillOver);
    }

    function mouseOut() {
        viz.select(this).select('rect.button')
            .attr('fill', model.fill);
    }

    function click() {
        var pd = viz.getModel('padding');
        mouseOut.call(this);
        if (!viz.__expanded) {
            viz.__expanded = {
                padding: KEYS.reduce((o, key) => {
                    if(pd[key]) {
                        o[key] = pd[key];
                        pd[key] = 0;
                    }
                    return o;
                }, {})
            };
            visual.deactivate();
            viz.activate();
        } else {
            var padding = viz.__expanded.padding;
            delete viz.__expanded;
            visual.activate();
            KEYS.forEach(key => {
                if (padding[key]) pd[key] = padding[key];
            });
        }
        visual.redraw(false);
    }

});
