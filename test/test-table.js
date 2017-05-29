import {view, viewElement} from 'd3-view';
import {viewTable} from '../index';


describe('table', () => {

    it ('plugin', () => {
        var vm = view().use(viewTable);

        expect(vm.components.get('d3-table')).toBeTruthy();
    });

    it ('columns', () => {
        var el = viewElement('<div><d3-table schema="table1"></d3-table></div>');
        var vm = view({
            model: {
                table1: {
                    properties: {
                        name: {
                            type: "string"
                        },
                        age: {
                            type: "integer"
                        }
                    }
                }
            }
        }).use(viewTable);

        vm.mount(el);
        var table = vm.sel.select('table');
        expect(table.node()).toBeTruthy();
        var headers = table.selectAll('th');
        expect(headers.size()).toBe(2);
    });

});
