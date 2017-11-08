import {test} from './utils';

import {randomPath} from 'd3-quant';

import {DataStore} from '../index';


describe('dataStore', () => {

    it('test registration', () => {
        var store = new DataStore();
        expect(store.size()).toBe(0);
        expect(store.source('foo')).toBe(undefined);
        expect(store.source('foo', {})).toBe(store);
        expect(store.size()).toBe(1);
        var foo = store.source('foo');
        expect(foo).toBeTruthy(store);
        expect(store.source('foo', null)).toBe(foo);
        expect(store.source('foo')).toBe(undefined);
    });

    test('test expression provider', async () => {
        var store = new DataStore({
            $randomPath: randomPath
        });
        expect(store.model).toBeTruthy();
        expect(store.size()).toBe(0);

        // add provider to store
        store.addSources({
            type: 'expression',
            expression: '$randomPath(300)'
        });
        var source = store.source('default');
        expect(source.name).toBe('default');
        expect(source.type).toBe('expression');
        //
        // get the provider data
        var cf = await source.getData();
        expect(cf).toBeTruthy();
        expect(cf.size()).toBe(300);
    });

    test('test array provider', async () => {
        var store = new DataStore();
        store.addSources({
            name: 'random',
            data: randomPath(20)
        });
        expect(store.size()).toBe(1);
        expect(store.source('random').type).toBe('array');
        expect(store.source('random').name).toBe('random');
        var df = await store.getData('random');
        expect(df).toBeTruthy();
        expect(df.size()).toBe(20);
    });
});
