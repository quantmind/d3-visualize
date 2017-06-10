import {isoParse} from 'd3-time-format';

import locale from '../data/locale';


export const parsers = {
    date: isoParse,

    string (value) {
        return ''+value;
    }
};

// formatters
export const formatters = {

    number (value) {
        return value;
    },

    date (value) {
        return locale.formatDate(value);
    },

    boolean (value) {
        return value;
    }
};
