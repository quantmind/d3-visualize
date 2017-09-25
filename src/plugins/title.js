// Title plot annotation
import {isString} from 'd3-let';

import {visuals} from '../core/base';
import globalOptions from '../core/options';


globalOptions.title = {
    text: null,
    fontSize: '10px'
};


visuals.events.on('after-init.title', viz => {
    var title = viz.options.title;
    if (isString(title)) viz.options.title = {text: title};
});
