//
//  Add a menu buttom to a visual

import globalOptions from '../core/options';
import {visuals} from '../core/base';
import {sizeValue} from '../utils/size';


globalOptions.menu = {
    display: false,
    height: 30
};


visuals.events.on('after-init.menu', viz => {
    if (viz.visualType === 'visual') {
        var menu = viz.getModel('menu');
        if (menu.display) {
            viz.menu = viz.sel.append('nav').classed('d3-nav', true);
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
        height = sizeValue(menu.height, viz.height);
    viz.menu.style('height', `${height}px`);
}
