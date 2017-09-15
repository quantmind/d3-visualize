import {viewProviders} from 'd3-view';

const prefix = '[d3-table]';


export default function (msg) {
    viewProviders.logger.warn(`${prefix} ${msg}`);
}
