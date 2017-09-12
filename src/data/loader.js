import {viewProviders} from 'd3-view';
import {csvParseRows} from 'd3-dsv';

import warn from './warn';


export default function DataLoader (url) {
	this.url = url;
}

DataLoader.prototype = {

	load (columns) {
        var fetch = viewProviders.fetch;
        return fetch(this.url).then((response) => {
            var ct = (response.headers.get('content-type') || '').split(';')[0];
            if (ct === 'text/plain')
                return response.text().then((data) => csvToJson(columns, data));
            else if (ct === 'application/json')
                return response.json();
            else {
                warn(`Cannot load content type '${ct}'`);
            }
        });
	}
};


function csvToJson(columns, data) {
    let col, key;

    return csvParseRows(data, (d) => {

        return d.reduce((o, v, i) => {
            col = columns[i];
            if (col) {
                key = col.name;
            } else {
                key = `key${i}`;
            }
            o[key] = v;
            return o;
        }, {});
    });
}
