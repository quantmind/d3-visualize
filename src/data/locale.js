// utility to load and set locale
import {formatDefaultLocale} from 'd3-format';
import {timeFormatDefaultLocale, timeFormat} from 'd3-time-format';

import dataSources from './sources';

//
// manage locale
export default  {
    formatDate: timeFormat('%d/%m/%Y'),

    formatDateTime: timeFormat('%a %e %b %X %Y'),

    load (symbol) {
        var locales = this,
            source1 = dataSources.create(`https://unpkg.com/d3-format/locale/${symbol}.json`),
            source2 = dataSources.create(`https://unpkg.com/d3-time-format/locale/${symbol}.json`);

        return Promise.all([
            source1.load().then(
                locale => {
                    locales.symbol = symbol;
                    locales.number = locale;
                    formatDefaultLocale(locale);
                }
            ),
            source2.load().then(
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
