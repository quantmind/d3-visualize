import {csvParse} from 'd3-dsv';
import {isObject} from 'd3-let';
import {viewProviders} from 'd3-view';

import warn from './warn';
import isUrl from '../utils/isurl';

//
//  Remote dataSource
//  ===================
//
//  handle Json and csv data
export default {

    init (config) {
        if (isUrl(config)) return {url: config};
        else if (isObject(config) && config.url)
            return config;
    },

    load () {
        var fetch = viewProviders.fetch;
        if (!fetch) {
            warn('fetch provider not available, cannot submit');
            return;
        }
        return fetch(this.url).then(parse);
    }
};


function parse (response) {
    var ct = (response.headers.get('content-type') || '').split(';')[0];
    if (ct === 'text/plain' || ct === 'text/csv')
        return response.text().then(csvParse);
    else if (ct === 'application/json')
        return response.json();
    else {
        warn(`Cannot load content type '${ct}'`);
        return [];
    }
}
