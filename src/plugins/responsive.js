import {inBrowser} from 'd3-let';
import {viewDebounce} from 'd3-view';
import {select} from 'd3-selection';

import {visuals} from '../core/base';
import globalOptions from '../core/options';


if (!globalOptions.resizeDelay)
    globalOptions.resizeDelay = 200;


if (inBrowser) {
    var resize = viewDebounce(() => {
        visuals.live.forEach(p => p.resize());
    }, globalOptions.resizeDelay);

    select(window).on('resize.visuals', resize);
}
