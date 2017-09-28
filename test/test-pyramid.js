import {view} from 'd3-view';

import {PyramidChart} from '../index';
import {pyramid} from '../index';


describe('pyramid', () => {
    var vm = view();

    it ('pyramid defaults', () => {
        var t = pyramid();
        expect(t.height()).toBe(1);
        expect(t.base()).toBe(1);
        expect(t.pad()()).toBe(0);
        expect(t.value()(5)).toBe(5);

        expect(t.height(5).height()).toBe(5);
        expect(t.base(3).base()).toBe(3);
        expect(t.pad(0.1).pad()()).toBe(0.1);
    });

    it ('pyramid data', () => {
        var t = pyramid();
        var data = t([3, 56, 23, 15, 40]);
        expect(data.length).toBe(5);

        expect(data[0].value).toBe(3);
        expect(data[0].index).toBe(0);
        expect(data[0].fraction).toBe(3/56);
        expect(data[0].points.length).toBe(3);

        expect(data[1].value).toBe(56);
        expect(data[1].index).toBe(4);
        expect(data[1].fraction).toBe(1);
        expect(data[1].points.length).toBe(4);

        expect(data[2].value).toBe(23);
        expect(data[2].index).toBe(2);
        expect(data[2].fraction).toBe(23/56);
        expect(data[1].points.length).toBe(4);

        expect(data[3].value).toBe(15);
        expect(data[3].index).toBe(1);
        expect(data[3].fraction).toBe(15/56);
        expect(data[1].points.length).toBe(4);

        expect(data[4].value).toBe(40);
        expect(data[4].index).toBe(3);
        expect(data[4].fraction).toBe(40/56);
        expect(data[1].points.length).toBe(4);
    });

    it ('pyramid data with pad', () => {
        var t = pyramid().pad(0.01);
        var data = t([3, 56, 23, 15, 40]);
        expect(data[0].points.length).toBe(3);
        expect(data[0].points[0][0]).toBe(0);
        expect(data[0].points[0][1]).toBe(0);
        expect(data[1].points[0][0]).toBeLessThan(data[0].points[2][0]);
        expect(data[1].points[0][1]).toBeGreaterThan(data[0].points[2][1]);
        expect(data[1].points[1][0]).toBeGreaterThan(data[0].points[1][0]);
        expect(data[1].points[1][1]).toBeGreaterThan(data[0].points[1][1]);
    });

    it ('Pyramid Chart Object', () => {
        var el = vm.createElement('div').node(),
            p = new PyramidChart(el);
        expect(p.visualType).toBe('pyramidchart');
        //var fill = p.fill([{index: 2}, {index: 0}, {index: 1}]),
    //        domain = fill.scale.domain();
        ///expect(domain[0]).toBe(0);
        //expect(domain[1]).toBe(2);
        //expect(fill({index: 0})).toBe('rgb(110, 64, 170)');
        //expect(fill({index: 1})).toBe('rgb(26, 199, 194)');
        //expect(fill({index: 2})).toBe('rgb(175, 240, 91)');
    });
});
