import {viewProviders} from 'd3-view';

const prefix = '[d3-table]';


export default function (msg) {
    providers.logger.warn(`${prefix} ${msg}`);
}
