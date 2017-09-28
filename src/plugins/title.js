// Title plot annotation
import {isString} from 'd3-let';

import {visuals} from '../core/base';
import globalOptions from '../core/options';


globalOptions.title = {
    text: null,
    fontSize: '5%',
    minFintSize: 15
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
    var size = Math.max(viz.dim(title.fontSize, viz.height), title.minFintSize);
    viz.menu.select('.title').html(title.text).style('font-size', `${size}px`);
}
