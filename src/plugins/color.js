import globalOptions from '../core/options';
import {vizPrototype} from '../core/chart';


globalOptions.color = {
    scale: 'cool'
};


//
//  Color scale method
//  ==========================
vizPrototype.colorScale = function () {
    var color = this.getModel('color');
    return color;
};
