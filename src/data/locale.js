// utility to set locale
import {formatDefaultLocale} from 'd3-format';
import {timeFormatDefaultLocale, timeFormat} from 'd3-time-format';

import json from './json';

//
// manage locale
export default {
    formatDate: timeFormat('%d/%m/%Y'),

    formatDateTime: timeFormat('%a %e %b %X %Y'),

    load (symbol) {
        var locales = this;

        return Promise.all([
            json(`https://unpkg.com/d3-format/locale/${symbol}.json`).then(
                locale => {
                    locales.symbol = symbol;
                    locales.number = locale;
                    formatDefaultLocale(locale);
                }
            ),
            json(`https://unpkg.com/d3-time-format/locale/${symbol}.json`).then(
                locale => {
                    locales.time = locale;
                    locales.formatDate = timeFormat(locale.date);
                    locales.formatDateTime = timeFormat(locale.dateTime);
                    timeFormatDefaultLocale(locale);
                }
            )
        ]);
    }
};
