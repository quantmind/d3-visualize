// Required for async/await syntax in tests
import 'es6-promise';
import 'crossfilter';
import {select} from 'd3-selection';
import {viewDebounce} from 'd3-view';


export function trigger (target, event, process) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(event, true, true);
    if (process) process(e);
    target.dispatchEvent(e);
}


export function test (name, runAsync) {
    return it(name, done => {
        runAsync().then(done, done.fail);
    });
}


export function domElement (tag) {
    return select('body').append(tag || 'div').node();
}

export const nextTick = viewDebounce();
