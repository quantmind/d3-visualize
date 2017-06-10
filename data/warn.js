import {viewProviders} from 'd3-view';

const prefix = '[d3-data]';


export default function (msg) {
    providers.logger.warn(`${prefix} ${msg}`);
}
