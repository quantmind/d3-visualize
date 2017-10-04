// Title plot annotation
import {isString} from 'd3-let';

import {visuals} from '../core/base';
import globalOptions from '../core/options';


globalOptions.title = {
    text: null,
    fontSize: '5%',
    minFontSize: 15,
    maxFontSize: 25
};


visuals.events.on('before-init.title', viz => {
    var title = viz.options.title;
    if (isString(title)) viz.options.title = {text: title};
});


visuals.events.on('before-draw.title', viz => {
    var title = viz.getModel('title');
    if (!title.text) return;
    var visual = viz.isViz ? viz.visualParent : viz;
    if (visual.visualType === 'visual' && visual.menu) menuTitle(visual, title, viz);
});


function menuTitle(visual, title, viz) {
    var height = number(visual.menu.style('height')),
        maxSize = title.maxFontSize ? Math.min(height-4, title.maxFontSize) : height-4,
        size = viz.dim(title.fontSize, visual.width, title.minFontSize, maxSize);
    visual.menu.select('.title')
        .html(title.text)
        .style('font-size', `${size}px`)
        .style('line-height', `${height}px`);
}


function number (px) {
    return +px.substring(0, px.length-2);
}
