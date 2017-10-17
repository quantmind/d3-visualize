// Required for async/await syntax in tests
import 'es6-promise';
import 'crossfilter';
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

export const nextTick = viewDebounce();
