//
//  Add formatting capabilities to visuals
import {visuals} from '../core/base';
import {vizPrototype} from '../core/chart';
import cachedFormat from '../utils/format';
import cachedFormatTime from '../utils/format-time';

//
// Visual Data Context
visuals.options.dataContext = {
    $format: cachedFormat,
    $formatTime: cachedFormatTime
};


vizPrototype.format = function (fmt) {
    var store = this.dataStore,
        formatter = store.eval(fmt);
    if (formatter) return formatter;
    try {
        return cachedFormat(fmt);
    } catch (e) {
        return cachedFormatTime(fmt);
    }
};
