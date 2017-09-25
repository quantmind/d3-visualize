import {view} from 'd3-view';

import {visualComponents, PieChart} from '../index';


describe('piechart', () => {

    it ('Pie Chart Default', () => {
        var vm = view().use(visualComponents),
            el = vm.createElement('div').node();
        var pie = new PieChart(el);
        expect(pie.visualParent).toBeTruthy();
        expect(pie.visualType).toBe('piechart');
        expect(pie.model).toBeTruthy();
        var model = pie.getModel('piechart');
        expect(model.innerRadius).toBe(0);
        model = pie.getModel('visual');
        expect(model.render).toBe('svg');
    });

    it ('Pie Chart Overrride', () => {
        var vm = view().use(visualComponents),
            el = vm.createElement('div').node();
        var pie = new PieChart(el, {
            piechart: {
                innerRadius: 0.9
            }
        });
        var model = pie.getModel('piechart');
        expect(model.innerRadius).toBe(0.9);
        expect(model.cornerRadius).toBe(0);
    });

});
