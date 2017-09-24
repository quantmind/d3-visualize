import {view} from 'd3-view';

import {visualComponents, PieChart} from '../index';


describe('piechart', () => {

    it ('Pie Chart', () => {
        var vm = view().use(visualComponents),
            el = vm.createElement('div').node();
        var pie = new PieChart(el);
        expect(pie.visual).toBeTruthy();
        expect(pie.visualType).toBe('piechart');
        expect(pie.model).toBeTruthy();
    });

});
