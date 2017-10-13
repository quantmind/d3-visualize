import {vizPrototype} from '../core/chart';
import {visuals} from '../core/base';


visuals.options.font = {
    size: '3%',
    minSize: 10,
    maxSize: 20
};


vizPrototype.font = function (box) {
    var model = this.getModel(),
        font = this.getModel('font'),
        size = this.dim(font.size, box.height, font.minSize, font.maxSize);
    if (model.fontSizeMultiplier)
        size *= model.fontSizeMultiplier;
    return size;
};
