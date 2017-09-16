// Title plot annotation
import {isString} from 'd3-let';

import {visualEvents} from '../core/base';


visualEvents.on('init.title', title);


function title (options) {
    var title = options.title || {};
    if (isString(title)) title = {text: title};
    this.title = title;
}
