import {vizPrototype} from '../core/chart';
import {visuals} from '../core/base';


visuals.options.font = {
    size: '3%',
    minSize: 10,
    maxSize: 20,
    stroke: '#333',
    family: null
};


vizPrototype.font = function (box, font) {
    font = font ? font : this.getModel('font');

    var model = this.getModel(),
        size = this.dim(font.size, box.height, font.minSize, font.maxSize);
    if (model.fontSizeMultiplier)
        size *= model.fontSizeMultiplier;
    return size;
};
