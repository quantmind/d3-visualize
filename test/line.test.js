import {visuals} from '../index';


describe('LineChart -', () => {

    test('defaults', () => {
        var line = visuals.options.linechart;
        expect(line).toBeTruthy();
        expect(line.curve).toBe('natural');
    });

});
