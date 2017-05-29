import {isObject} from 'd3-let';
import {viewWarn} from 'd3-view';
import {formatters, parsers} from './formatters';


// Create table columns from schema
export default function (model, schema) {
	if (!schema) return;
    if (!isObject(schema.properties))
        return viewWarn('schema properties should be an object');

    var columns = model.columns;
    let col;
    for (let key in schema.properties) {
        col = schema.properties[key];
        if (isObject(col)) {
            if (!col.name) col.name = key;
            if (!col.label) col.label = col.name;
            if (!col.hidden) col.hidden = false;
            if (!col.$parse) col.$parse = parsers[col.type] || parsers.string;
            if (!col.$html) col.$html = formatters[col.type] || $html;
            columns.push(model.$new(col));
        }
    }
}


function $html (value) {
    return value;
}
