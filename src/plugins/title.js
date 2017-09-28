// Title plot annotation
import {isString} from 'd3-let';

import {visuals} from '../core/base';
import globalOptions from '../core/options';


globalOptions.title = {
    text: null,
    fontSize: '5%',
    minFontSize: 15
};


visuals.events.on('before-init.title', viz => {
    var title = viz.options.title;
    if (isString(title)) viz.options.title = {text: title};
});


visuals.events.on('before-draw.title', viz => {
    var title = viz.getModel('title');
    if (!title.text) return;
    if (viz.visualType === 'visual' && viz.menu) menuTitle(viz, title);
});


function menuTitle(viz, title) {
    var height = number(viz.menu.style('height')),
        size = viz.dim(title.fontSize, viz.height, title.minFontSize, height-4);
    viz.menu.select('.title')
        .html(title.text)
        .style('font-size', `${size}px`)
        .style('line-height', `${height}px`);
}


function number (px) {
    return +px.substring(0, px.length-2);
}
