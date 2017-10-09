//
//  Map Fields Transform
//  ========================
//
//  Convert a set af fields to a different data type
//
import {map} from 'd3-collection';
import {isString} from 'd3-let';
import {utcParse} from 'd3-time-format';

import transformFactory from './base';
import warn from '../utils/warn';
import globalOptions from '../core/options';


globalOptions.dateFormat = '%d-%b-%y';


const converters = {
    date (entry) {
        return utcParse(entry.dateFormat || globalOptions.dateFormat);
    },
    number () {
        return parseFloat;
    }
};

export default transformFactory({
    shema: {
        description: "map a field values into another type",
        properties: {
            fields: {
                type: "object"
            },
            dateFormat: {
                type: "string"
            }
        },
        required: ["fields"]
    },
    transform (frame, config) {
        var fields = map(config.fields),
            mappers = [];
        let i, converter;

        fields.each((entry, key) => {
            if (isString(entry)) entry = {type: entry};
            converter = converters[entry.type];
            if (!converter) warn(`Cannot convert field ${key} to type ${entry.type}`);
            else mappers.push([key, converter(entry)]);
        });

        if (mappers.length)
            frame = frame.map(d => {
                for (i=0; i<mappers.length; ++i)
                    d[mappers[i][0]] = mappers[i][1](d[mappers[i][0]]);
                return d;
            });

        return frame;
    }
});
