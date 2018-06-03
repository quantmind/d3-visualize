import './utils.js';

import {niceRange} from '../index';


describe('nice range', () => {

    test('nice range', () => {
        expect(niceRange([1, 10], 10)).toEqual([1, 10]);
        expect(niceRange([1.32, 10], 10)).toEqual([1.3, 10.3]);
        expect(niceRange([23.4, 9450], 10)).toEqual([0, 10000]);
        expect(niceRange([23.4, 9450], 8)).toEqual([0, 9600]);
    });

});
