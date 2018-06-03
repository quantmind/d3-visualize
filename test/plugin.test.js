import './utils.js';

import {isFunction} from 'd3-let';
import {viewProviders} from 'd3-view';

import {createChart} from '../index';


describe('plugin', () => {

    test('visualPlugins', () => {
        viewProviders.visualPlugins = {
            ggggg: {
                options: {
                    a: 1,
                    b: 2
                },
                prototype: {
                    gggTest () {
                        return 'OK';
                    }
                }
            },
            hhhhh: {
                options: {
                    c: 1,
                    d: 2
                },
                prototype: {
                    hhhTest () {
                        return 'OK2';
                    }
                }
            }
        };
        var Chart = createChart('ggggg', {
            doDraw () {}
        });

        expect(isFunction(Chart.prototype.gggTest)).toBe(true);
        expect(isFunction(Chart.prototype.hhhTest)).toBe(true);
        expect(viewProviders.visualPlugins).toBe(null);

        var Chart2 = createChart('hhhhh', {
            doDraw () {}
        });
        expect(isFunction(Chart2.prototype.gggTest)).toBe(true);
        expect(isFunction(Chart2.prototype.hhhTest)).toBe(true);
    });

});
