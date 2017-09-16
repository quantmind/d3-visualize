import {inBrowser} from 'd3-let';
import {viewDebounce} from 'd3-view';
import {select} from 'd3-selection';

import {liveVisuals} from '../core/base';
import globalOptions from '../core/options';


if (!globalOptions.resizeDelay)
    globalOptions.resizeDelay = 200;


if (inBrowser) {
    var resize = viewDebounce(() => {
        liveVisuals.forEach(p => p.resize());
    }, globalOptions.resizeDelay);

    select(window).on('resize.visuals', resize);
}
