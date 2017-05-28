import createColumns from './columns';
import DataLoader from './data';


const tableTpl = `<table d3-class="style.tableClass">
<thead>
<tr><th d3-for="col in columns" d3-html="col.label"></th></tr>
</thead>
<tbody>
<tr d3-for="row in data">
<td d3-for="col in row" d3-html="col.html"></td>
</tr>
</tbody>
</table>`;


export default {
	props: [
		'schema',	// Schema is a collection of fields to display in the table
		'dataUrl',	// Optional url to fetch data from
	],

	model: {
		header: true, // show header
		data: [],     // table data
		columns: []   // table columns
	},

	render (data) {
		var model = this.model;

		model.columns = createColumns(data.schema);
		if (data.dataUrl) this.dataLoader = new DataLoader(data.dataUrl);
		return this.viewElement(tableTpl);
	},

	mounted () {
		if (this.dataLoader)
			this.dataLoader.load();
	}
};
