import {view} from 'd3-view';
import {viewTable} from '../index';


describe('table', () => {

    it ('plugin', () => {
        var vm = view().use(viewTable);

        expect(vm.components.get('d3-table')).toBeTruthy();
    });

});
