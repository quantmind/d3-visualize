import {isObject, isArray} from 'd3-let';

import {formatters, parsers} from '../data/formatters';


//
// Create table columns from schema
export default function (schema) {
    var columns = [];
    let col;

	if (!schema) return columns;

    if (isArray(schema))
        schema = {properties: schema};

    if (isObject(schema.properties)) {
        for (let key in schema.properties) {
            col = schema.properties[key];
            if (isObject(col)) {
                if (!col.name) col.name = key;
                columns.push(col);
            }
        }
    } else
        columns.push(...schema.properties);

    return columns.map((col) => {
        if (!isObject(col)) col = {name: col};
        if (!col.label) col.label = col.name;
        if (!col.hidden) col.hidden = false;
        if (!col.$parse) col.$parse = parsers[col.type] || parsers.string;
        if (!col.$html) col.$html = formatters[col.type] || $html;
        return col;
    });
}


function $html (value) {
    return value;
}
