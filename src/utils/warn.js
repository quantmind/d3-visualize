import {viewProviders} from 'd3-view';

const prefix = '[d3-visualize]';


export default function (msg) {
    viewProviders.logger.warn(`${prefix} ${msg}`);
}
