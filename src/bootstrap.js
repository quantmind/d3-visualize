import assign from 'object-assign';

// bootstrap styling to the table
const defaults = {
    over: true,
    small: true,
    bordered: true,
    loadingClass: 'table-info',
    loadingTextClass: 'text-center'
};

// This plugin inject the style function to the d3-table component
export default {

    install (view) {
        var d3table = view.components.get('d3-table');
        if (d3table)
            d3table.prototype.style = bootstrapTable;
    }
};


function bootstrapTable (data) {
    data = assign({}, defaults, data);
    data.tableClass = 'table table-responsive';
    if (data.striped) data.tableClass += ' table-striped';
    if (data.over) data.tableClass += ' table-hover';
    if (data.bordered) data.tableClass += ' table-bordered';
    if (data.small) data.tableClass += ' table-sm';
    return data;
}
