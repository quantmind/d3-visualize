import {viewProviders} from 'd3-view';

const prefix = '[d3-visualize]';


export default function (msg, err) {
    viewProviders.logger.warn(`${prefix} ${msg}`);
    if (err) viewProviders.logger.error(err.stack);
}
