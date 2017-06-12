// bootstrap styling to d3 visualize table
import assign from 'object-assign';


const defaults = {
    over: true,
    small: true,
    bordered: true,
    loadingClass: 'table-info',
    loadingTextClass: 'text-center'
};


export default function (table, options) {
    var style = assign({}, defaults, options);
    table.model.style = style;

    style.tableClass = 'table table-responsive';
    if (style.striped) style.tableClass += ' table-striped';
    if (style.over) style.tableClass += ' table-hover';
    if (style.bordered) style.tableClass += ' table-bordered';
    if (style.small) style.tableClass += ' table-sm';
}
