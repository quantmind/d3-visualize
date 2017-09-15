import {viewProviders} from 'd3-view';

const prefix = '[d3-data-source]';


export default function (msg) {
    viewProviders.logger.warn(`${prefix} ${msg}`);
}
