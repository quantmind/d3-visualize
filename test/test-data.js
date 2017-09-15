import './utils';
import {DataStore, randomPath} from '../index';


describe('dataStore', () => {

    it('test registration', () => {
        var store = new DataStore();
        expect(store.size()).toBe(0);
        expect(store.serie('foo')).toBe(undefined);
        expect(store.serie('foo', {})).toBe(store);
        expect(store.size()).toBe(1);
        var foo = store.serie('foo');
        expect(foo).toBeTruthy(store);
        expect(store.serie('foo', null)).toBe(foo);
        expect(store.serie('foo')).toBe(undefined);
        expect(store.size()).toBe(0);
    });

    it('test expression provider', () => {
        var store = new DataStore({
            randomPath: randomPath
        });
        expect(store.model).toBeTruthy();
        expect(store.size()).toBe(0);

        // add provider to store
        var serie = store.add('randomPath(300)');
        expect(serie.name).toBe('default');
        expect(serie.type).toBe('expression');
        expect(store.serie('default')).toBe(serie);
        //
        // get the provider data
        expect(serie.cf).toBeTruthy();
        expect(serie.size()).toBe(300);
    });

    it('test array provider', () => {
        var store = new DataStore(),
            data = randomPath(20),
            serie = store.add(data);
        expect(serie).toBeTruthy();
        expect(store.size()).toBe(1);
        expect(serie.size()).toBe(20);
        expect(serie.name).toBeTruthy();
    });
});
