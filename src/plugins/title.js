// Title plot annotation
import {isString} from 'd3-let';

import {visualEvents} from '../core/base';


visualEvents.on('after-init.title', (visual, options) => {
    var title = options.title;
    if (!title) return;
    if (isString(title)) title = {text: title};
    visual.title = title;
});
