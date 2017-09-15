import {isObject} from 'd3-let';
import {viewProviders, viewWarn as warn} from 'd3-view';
import isUrl from '../../utils/isurl';


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
        return fetch(this.url);
    }
};
