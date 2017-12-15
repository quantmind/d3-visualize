import {test, domElement} from './utils';
import {visuals, Tabular} from '../index';


describe('Tabular -', () => {

    it ('defaults', () => {
        var tabular = visuals.options.tabular;
        expect(tabular).toBeTruthy();
        expect(tabular.tableClass).toBe('table');
    });

    test('default table', async () => {
        var chart = new Tabular(domElement(), {data: 'fooo'});
        chart.dataStore.addSources({
            name: 'fooo',
            data: [1, 2, 3, 4]
        });
        expect(chart.visualType).toBe('tabular');
        var success = await chart.draw();
        expect(success).toBe(true);
        var model = chart.getModel();
        expect(model.columns.length).toBe(1);
        expect(model.columns[0]).toBe('data');
        chart.visualParent.sel.remove();
    });

});
