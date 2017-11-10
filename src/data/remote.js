import {csvParse, tsvParse} from 'd3-dsv';
import {set} from 'd3-collection';
import {isObject} from 'd3-let';
import {viewProviders} from 'd3-view';

import warn from './warn';
import isUrl from '../utils/isurl';

const CSV = set(['text/plain', 'text/csv', 'application/vnd.ms-excel']);
//
//  Remote dataSource
//  ===================
//
//  handle Json and csv data
export default {
    schema: {
        type: "object",
        description: 'Remote data resource',
        properties: {
            url: {
                type: "string",
                description: "url for fetching data"
            }
        }
    },

    getConfig (config) {
        if (isUrl(config)) return {url: config};
        else if (isObject(config) && config.url)
            return config;
    },

    initialise (config) {
        this.url = config.url;
    },

    getData () {
        var fetch = viewProviders.fetch,
            self = this;
        if (!fetch) {
            warn('fetch provider not available, cannot submit');
            return [];
        }
        return fetch(this.url).then(parse).then(data => self.asFrame(data));
    }
};


function parse (response) {
    var ct = (response.headers.get('content-type') || '').split(';')[0];
    if (CSV.has(ct))
        return response.text().then(csvParse);
    else if (ct === 'text/tab-separated-values')
        return response.text().then(tsvParse);
    else if (ct === 'application/json')
        return response.json();
    else {
        warn(`Cannot load content type '${ct}'`);
        return [];
    }
}
