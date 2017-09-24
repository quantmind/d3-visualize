import assign from 'object-assign';
import {visuals} from './base';


export default function (type, proto) {

    function Paper (options) {
        this.options = options;
    }

    Paper.prototype = assign({}, paperPrototype, proto);

    visuals.paper[type] = Paper;
    return Paper;
}


const paperPrototype = {

};
