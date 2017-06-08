import {isObject, isArray} from 'd3-let';
import {viewWarn} from 'd3-view';
import {formatters, parsers} from './formatters';


// Create table columns from schema
export default function (model, schema) {
	if (!schema) return;
    if (isArray(schema))
        schema = {properties: schema};

    if (isObject(schema.properties)) {
        var columns = [];
        for (let key in schema.properties) {
            col = schema.properties[key];
            if (isObject(col)) {
                if (!col.name) col.name = key;
                columns.push(col);
            }
        }
        schema.columns = columns;
    } else {
        schema.columns = schema.properties;
    }

    if (!isArray(schema.columns))
        return viewWarn('schema columns should be an array');

    var columns = model.columns;
    let col;
    model.columns = schema.columns.map((col) => {
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
