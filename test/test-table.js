import {view} from 'd3-view';
import {visualComponents} from '../index';


describe('table', () => {

    it ('plugin', () => {
        var vm = view().use(visualComponents);

        expect(vm.components.get('tabular')).toBeTruthy();
    });

    it ('columns', () => {
        // var el = viewElement('<div><tabular schema="table1"></tabular></div>');
        var vm = view({
            model: {
                table1: {
                    fields: {
                        name: {
                            type: "string"
                        },
                        age: {
                            type: "integer"
                        }
                    }
                }
            }
        }).use(visualComponents);

        expect(vm).toBeTruthy();
        // vm.mount(el);
        // var table = vm.sel.select('table');
        // expect(table.node()).toBeTruthy();
        // var headers = table.selectAll('th');
        // expect(headers.size()).toBe(2);
    });

});
