import {viewProviders} from 'd3-view';


// Fetch JSON data from url
export default function (url) {
    var fetch = viewProviders.fetch;

    return fetch(url).then((response) => {
        var ct = (response.headers.get('content-type') || '').split(';')[0];
        if (ct === 'application/json')
            return response.json();
        else
            throw new Error(`Expected JSON content type, got ${ct}`);
    });
}