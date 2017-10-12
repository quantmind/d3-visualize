import {require} from 'd3-view';
import {isString} from 'd3-let';

import createChart from '../core/chart';
import {Div} from '../core/paper';


require.libs.set('clusterize', 'https://cdnjs.cloudflare.com/ajax/libs/clusterize.js/0.17.6/clusterize.min.js');


export default createChart('tabular', {
    requires: ['clusterize'],

    options: {
        columns: null,
        tableClass: 'table'
    },

    doDraw (frame, Clusterize) {
        var self = this,
            model = this.getModel(),
            box = this.boundingBox(),
            columns = this.getColumns(model),
            paper = this.paper(),
            group = paper.group().selectAll('table').data(['head', 'body']),
            rows = frame.data.map(d => self.getRow(columns, d));

        group
            .enter()
                .call(tableElement);
            .merge()
                .call(updateTableElement)

        if (!this._cluster)
            this._cluster = new Clusterize({
                rows: []
            });

        this._cluster.update(rows);

        function tableElement (type) {
            var el = self.select(this);
            if (type === 'head') return self.tableHead(el, model, columns);
            else return self.tableBody(el, model);
        }

        function updateTableElement (type) {
            var el = self.select(this);
            if (type === 'head') return self.tableHead(el, model, columns);
            else return self.tableBody(el, model);
        }
    },

    getColumns (model) {
        return model.columns.map(column => {
            if (isString(column)) column = {name: column};
            if (!column.label) column.label = column.name;
            if (!column.type) column.type = 'string';
            return column;
        });
    },

    getRow (columns, data) {
        let value;
        return columns.reduce((row, column) => {
            value = data[column.name];
            row += `<td>${value}</td>`;
            return row;
        }, '<tr>') + '</tr>';
    },

    paper () {
        if (!this._paper) this._paper = new Div(this);
        return this._paper;
    },

    tableHead (el, model, columns) {
        el.append('table')
            .classed(model.tableClass, true)
            .append('thead')
            .append('tr');
    }

});
