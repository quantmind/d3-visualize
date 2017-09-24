import {view} from 'd3-view';
import {isObject} from 'd3-let';

import {visualComponents, PieChart} from '../index';


describe('piechart', () => {

    it ('Bounding box', () => {
        var vm = view().use(visualComponents),
            el = vm.createElement('div').node();
        var pie = new PieChart(el),
            box = pie.boundingBox();
        expect(isObject(box.padding)).toBeTruthy();
        expect(isObject(box.margin)).toBeTruthy();
        expect(isObject(box.total)).toBeTruthy();
    });

});
