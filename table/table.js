// import {timeout} from 'd3-timer';
import assign from 'object-assign';
import {isString, isArray, isPromise} from 'd3-let';

import warn from './warn';
import createColumns from './columns';
import DataLoader from './data';
import tablePlugins from './plugins/index';
// import crossfilter from 'crossfilter';


const tableTpl = `<table d3-class="[style.tableClass, loadingData ? 'loading' : null]">
<thead d3-class="style.headerClass">
<tr d3-class="style.headerRowClass">
  <th d3-for="col in columns"
        d3-html="col.label"
        d3-if="!col.hidden">
  </th>
</tr>
<tr d3-if="loadingData" d3-class="style.loadingClass">
    <td d3-attr-colspan="columns.length">
        <p d3-class="style.loadingTextClass">loading data</p>
    </td>
</tr>
</thead>
<tbody></tbody>
</table>`;


export default {
    props: [
		'schema',	// Schema is a collection of fields to display in the table
		'dataurl',	// Optional url to fetch data from
        'style',    // table style
        'plugins',  // list of string/objects which add table plugins
	],

	model () {
        return {
            header: true,            // show header
            columns: [],             // table columns
            loadingData: false,
            style: {}
        };
	},

	render (data) {
		var self = this,
            model = this.model,
            plugins = data.plugins || [];
        // model.allData = crossfilter([]);
        this.records = {};
        this.data = [];
        this.template = tableTpl;

        model.style = this.style ? this.style(data.style || {}) : {};
		model.columns = createColumns(data.schema);
		if (data.dataurl) model.dataLoader = new DataLoader(data.dataurl);

        if (!isArray(plugins)) {
            warn('plugins should be an array');
        } else {
            var promises = [];
            let promise;
            plugins.forEach((plugin) => {
                if (isString(plugin)) plugin = {name: plugin};
                if (!tablePlugins[plugin.name])
                    warn(`Unknown table plugin ${plugin.name}`);
                else {
                    promise = tablePlugins[plugin.name](self, plugin);
                    if (isPromise(promise)) promises.push(promise);
                }
            });
            if (promises.length)
                 return Promise.all(promises).then(() => self.viewElement(self.template));
        }

		return this.viewElement(this.template);
	},

	mounted () {
        var vm = this,
            model = this.model;
		if (model.dataLoader) {
			var p = model.dataLoader.load(model.columns);
            if (p) {
                model.loadingData = true;
                p.then((data) => {
                    // var allData = model.allData;
                    model.loadingData = false;
                    addData(vm, data);
                }, (err) => {
                    model.loadingData = false;
                    return err;
                });
            }
        }
	}
};

// new data to include in the table
function addData (vm, newData) {
    var records = vm.records,
        data = vm.data,
        model = vm.model,
        delayData = newData;

    let record, value;

    newData = delayData.splice(0, 100);

    newData.forEach((d) => {
        if (d.id) {
            record = d.id ? records[d.id] : null;
            if (record)
                d = assign(record, d);
            else {
                data.push(d);
                records[d.id] = d;
            }
        } else
            data.push(d);
        model.columns.forEach((col) => {
            d[col.name] = col.$parse(d[col.name]);
        });
    });

    //if (delayData.length)
    //    timeout(() => addData(vm, delayData));

    var rows = vm.sel.select('tbody')
                .selectAll('tr').data(data);

    rows
        .enter()
            .append('tr')
            .attr('scope', 'row')
            .selectAll('td')
            .data(model.columns)
            .enter()
                .append('td')
                .style('display', (col) => {
                    return col.hidden ? 'none' : null;
                })
                .html(function (col) {
                    record = this.parentNode.__data__;
                    value = record[col.name];
                    return col.$html(value === undefined ? '' : value);
                });
}
