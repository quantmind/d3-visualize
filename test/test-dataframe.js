import {DataFrame} from '../index';


describe('DataFrame -', () => {

    it ('constructor', () => {
        var df = new DataFrame;
        expect(df.constructor).toBe(DataFrame);
        expect(df.size()).toBe(0);
        expect(df.store).toBe(undefined);
    });

});
