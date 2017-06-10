import assign from 'object-assign';

// bootstrap styling to the table
const defaults = {
    over: true,
    small: true,
    bordered: true,
    loadingClass: 'table-info',
    loadingTextClass: 'text-center'
};


export default function (table, options) {
    data = assign({}, defaults, data);
    data.tableClass = 'table table-responsive';
    if (data.striped) data.tableClass += ' table-striped';
    if (data.over) data.tableClass += ' table-hover';
    if (data.bordered) data.tableClass += ' table-bordered';
    if (data.small) data.tableClass += ' table-sm';
    return data;
}
