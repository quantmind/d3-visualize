// Title plot annotation
import {isString} from 'd3-let';

import {visuals} from '../core/base';
import globalOptions from '../core/options';


globalOptions.title = {
    text: null,
    size: '3%',
    minSize: 15,
    maxSize: 25,
    offset: ['10%', 0]
};


visuals.events.on('before-init.title', viz => {
    var title = viz.options.title;
    if (isString(title)) viz.options.title = {text: title};
});


visuals.events.on('after-draw.title', viz => {
    var title = viz.getModel('title');
    let visual = viz;
    if (visual.visualType === 'visual') delete visual.__title;
    else if (viz.isViz) visual = viz.visualParent;
    else return;
    if (!title.text) return;
    if (visual.menu && !visual.__title) {
        visual.__title = title;
        menuTitle(visual, title);
    } else if (viz.isViz) {
        var box = viz.boundingBox(true),
            font = viz.getModel('font'),
            stroke = title.stroke || font.stroke,
            size = viz.font(box, title),
            text = viz.group().selectAll('text.chartitle').data([title.text]),
            top = viz.dim(title.offset[0], box.vizHeight),
            left = viz.dim(title.offset[1], box.vizWidth),
            translate = viz.translate(box.margin.left+box.innerWidth/2+left, top);
        text.enter()
            .append('text')
            .classed('chartitle', true)
            .attr("transform", translate)
            .style("text-anchor", "middle")
            .style("font-size", size)
            .style("fill", stroke)
            .text(d => d)
        .merge(text)
            .transition()
            .attr("transform", translate)
            .style("font-size", size)
            .style("fill", stroke)
            .text(d => d);
    }
});


function menuTitle(visual, title) {
    var height = number(visual.menu.style('height')),
        maxSize = title.maxSize ? Math.min(height-4, title.maxSize) : height-4,
        size = visual.dim(title.size, visual.width, title.minSize, maxSize);
    visual.menu.select('.title')
        .html(title.text)
        .style('font-size', `${size}px`)
        .style('line-height', `${height}px`);
}


function number (px) {
    return +px.substring(0, px.length-2);
}
