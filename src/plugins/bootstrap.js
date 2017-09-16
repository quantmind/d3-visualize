//
//  bootstrap styling for tabular component
//  ==========================================
//
import assign from 'object-assign';


const defaults = {
    over: true,
    small: true,
    bordered: true,
    loadingClass: 'table-info',
    loadingTextClass: 'text-center'
};


export default function (table, options) {
    var style = table.model.style;
    style.$update(assign({}, defaults, options));

    style.tableClass = 'table table-responsive';
    if (style.striped) style.tableClass += ' table-striped';
    if (style.over) style.tableClass += ' table-hover';
    if (style.bordered) style.tableClass += ' table-bordered';
    if (style.small) style.tableClass += ' table-sm';
}
