import {isString} from 'd3-let';
import {dispatch} from 'd3-dispatch';

import createChart from '../core/chart';
import {Div} from '../core/paper';

const tableEvents = dispatch('rows-before', 'rows-after', 'columns');

export default createChart('tabular', {
    requires: ['clusterize.js'],
    paperType: 'div',
    events: tableEvents,

    formatters: {
        string (v) {
            return ''+v;
        }
    },

    schema: {
        columns: {
            type: "array"
        },
        tableClass: {
            type: "string",
            default: "table"
        },
        tableHeadClass: {
            type: "string",
            default: "head"
        },
        tableBodyClass: {
            type: "string",
            default: "body"
        }
    },

    doDraw () {
        var self = this,
            model = this.getModel('tabular'),
            box = this.boundingBox(),
            columns = this.getColumns(this.frame),
            paper = this.paper(),
            group = this.group().classed('clusterize', true),
            rows = this.frame.data.map(d => self.getRow(columns, d)),
            Clusterize = this.$,
            t = box.total;

        paper.sel.style('padding', `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`);
        // first time here?
        if (!this._cluster) {
            group.append('table')
                    .classed(model.tableClass, true)
                    .classed(model.tableHeadClass, true)
                    .append('thead')
                    .append('tr')
                    .selectAll('th')
                    .data(columns)
                    .enter()
                        .append('th')
                        .html(d => d.label)
                        .mount();
            group.append('div')
                    .classed('clusterize-scroll', true)
                    .append('table')
                    .classed(model.tableClass, true)
                    .classed(model.tableBodyClass, true)
                    .append('tbody')
                    .classed('clusterize-content', true);
            this._cluster = new Clusterize({
                rows: [],
                scrollElem: group.select('div.clusterize-scroll').node(),
                contentElem: group.select('tbody.clusterize-content').node()
            });
        }

        var head = group.select('table').style('height'),
            height = box.innerHeight - head.substring(0, head.length-2);
        group.style('font-size', this.font(box)+'px');
        group.select('.clusterize-scroll').style('max-height', height+'px');
        this.updateRows(rows);
    },

    // Create the columns for this tabular visual
    getColumns () {
        var model = this.getModel('tabular'),
            self = this;

        if (!model.columns) model.columns = this.frame.columns;

        return model.columns.map(column => {
            if (isString(column)) column = {name: column};
            if (!column.label) column.label = column.name;
            if (column.html) column.formatter = self.evalFormatter(column.html);
            else {
                if (!column.type) column.type = 'string';
                column.formatter = this.formatters[column.type] ? column.type : 'string';
            }
            return column;
        });
    },

    getRow (columns, data) {
        const self = this;
        let value;
        return columns.reduce((row, column) => {
            value = this.formatters[column.formatter](data[column.name], data, self);
            row += `<td>${value}</td>`;
            return row;
        }, '<tr>') + '</tr>';
    },

    updateRows(rows) {
        tableEvents.call('rows-before', undefined, this, rows);
        this._cluster.update(rows);
        tableEvents.call('rows-after', undefined, this);
    },

    group (name) {
        return this.paper().group(name);
    },

    destroy () {
        if (this._cluster) {
            this._cluster.destroy();
            delete this._cluster;
            this.group().html('');
        }
    },

    evalFormatter (html) {
        var store = this.dataStore;

        return (v, d) => {
            return store.eval(html, {d: d});
        };
    },

    paper () {
        if (!this._paper) this._paper = new Div(this);
        return this._paper;
    }
});
