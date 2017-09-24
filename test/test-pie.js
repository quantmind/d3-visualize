import {view} from 'd3-view';

import {visualComponents, PieChart} from '../index';


describe('piechart', () => {

    it ('Pie Chart Default', () => {
        var vm = view().use(visualComponents),
            el = vm.createElement('div').node();
        var pie = new PieChart(el);
        expect(pie.visual).toBeTruthy();
        expect(pie.visualType).toBe('piechart');
        expect(pie.model).toBeTruthy();
        expect(pie.visual).toBeTruthy();
        expect(pie.model.innerRadius).toBe(0);
        expect(pie.visual.model.render).toBe('svg');
    });

    it ('Pie Chart Overrride', () => {
        var vm = view().use(visualComponents),
            el = vm.createElement('div').node();
        var pie = new PieChart(el, {
            piechart: {
                innerRadius: 0.9
            }
        });
        expect(pie.model.innerRadius).toBe(0.9);
        expect(pie.model.cornerRadius).toBe(0);
    });

});
