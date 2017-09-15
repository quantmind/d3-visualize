import {inBrowser} from 'd3-let';
import {viewDebounce} from 'd3-view';
import {select} from 'd3-canvas-transition';

import globalOptions from '../core/options';
import liveVisuals from '../core/base';


if (!globalOptions.resizeDelay)
    globalOptions.resizeDelay = 200;


if (inBrowser) {
    var resize = viewDebounce(() => {
        liveVisuals.forEach(p => p.resize());
    }, globalOptions.resizeDelay);

    select(window).on('resize.visuals', resize);
}
