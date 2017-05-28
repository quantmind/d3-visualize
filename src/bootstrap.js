// bootstrap styling to the table

// This plugin inject the style function to the d3-table component
export default {

    install (view) {
        var d3table = view.components.get('d3-table');
        if (d3table)
            d3table.prototype.style = bootstrapTable;
    }
};


function bootstrapTable () {

}
