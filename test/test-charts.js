import {test} from './utils.js';
import {visuals} from '../index';

describe('visuals -', () => {

    test('options', async () => {
        expect(visuals.options).toBeTruthy();
        expect(visuals.schema).toBeTruthy();
    });

});
