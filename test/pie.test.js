import './utils.js';

import {view} from 'd3-view';

import {visualComponents, PieChart, Visual} from '../index';


describe('piechart', () => {
    var vm = view();

    test('Pie Chart Default', () => {
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

    test('Pie Chart Overrride', () => {
        var el = vm.createElement('div').node();
        var pie = new PieChart(el, {
            piechart: {
                innerRadius: 0.9
            }
        });
        var model = pie.getModel('piechart');
        expect(model.innerRadius).toBe(0.9);
        expect(model.cornerRadius).toBe(0);
    });

    test('Pie Chart in Visual', () => {
        var el = vm.createElement('div').node();
        var viz = new Visual(el, {
            piechart: {
                innerRadius: 0.8,
                cornerRadius: 5
            }
        });
        var model = viz.getModel('piechart');
        expect(model.innerRadius).toBe(0.8);
        expect(model.cornerRadius).toBe(5);
        var pie = viz.addVisual({
            type: 'piechart',
            piechart: {
                cornerRadius: 3
            }
        });
        expect(pie.visualParent).toBe(viz);
        var m2 = pie.getModel();
        expect(m2.cornerRadius).toBe(3);
        expect(m2.innerRadius).toBe(0.8);
    });

});
