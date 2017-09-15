// Required for async/await syntax in tests
import 'regenerator-runtime/runtime';
import {fluidPaper} from '../index';


export function removePaper (paper) {
    expect(fluidPaper.live.indexOf(paper)).toBeGreaterThan(-1);
    paper.destroy();
    expect(fluidPaper.live.indexOf(paper)).toBe(-1);
}
