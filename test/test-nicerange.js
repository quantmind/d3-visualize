import {niceRange} from '../index';


describe('nice range', () => {

    it ('nice range', () => {
        expect(niceRange([1, 10], 10)).toEqual([1, 10]);
    });

});
