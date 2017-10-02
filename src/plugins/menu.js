//
//  Add a menu buttom to a visual

import globalOptions from '../core/options';
import {visuals} from '../core/base';


globalOptions.menu = {
    display: false,
    height: '8%',
    maxHeight: 50,
    minHeight: 20
};


visuals.events.on('after-init.menu', viz => {
    if (viz.visualType === 'visual') {
        var menu = viz.getModel('menu');
        if (menu.display) {
            viz.menu = viz.sel.insert('nav', ':first-child').classed('d3-nav navbar p-1', true);
            viz.menu.append('h4').classed('title', true);
        }
    }
});

visuals.events.on('before-draw.menu', viz => {
    if (viz && viz.menu) {
        refreshMenu(viz);
    }
});


function refreshMenu(viz) {
    var menu = viz.getModel('menu'),
        height = viz.dim(menu.height, viz.height, viz.minHeight, viz.maxHeight);
    viz.menu.style('height', `${height}px`);
}
