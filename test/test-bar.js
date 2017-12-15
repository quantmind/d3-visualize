import {test, domElement} from './utils';
import {visuals, BarChart} from '../index';


describe('BarChart -', () => {

    it ('defaults', () => {
        var bar = visuals.options.barchart;
        expect(bar).toBeTruthy();
        expect(bar.orientation).toBe('vertical');
    });

    test('default chart', async () => {
        var chart = new BarChart(domElement());
        expect(chart.visualType).toBe('barchart');
        expect(chart.visualRoot).not.toBe(chart);
        expect(chart.model.uid).toBeTruthy();
        expect(chart.toString()).toBeTruthy();
        expect(chart.isd3).toBe(true);
        expect(chart.active).toBe(true);
        var success = await chart.draw();
        expect(success).toBe(false);
        expect(chart.model.data).toBe(undefined);
        chart.model.data = 'fooo';
        success = await chart.draw();
        expect(success).toBe(false);
        chart.dataStore.addSources({
            name: 'fooo',
            data: [1, 2, 3, 4]
        });
        success = await chart.draw();
        expect(success).toBe(true);
        chart.visualParent.sel.remove();
    });


});
