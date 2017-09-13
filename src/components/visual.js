import assign from 'object-assign';

import {vizComponent} from './dashboard';


// Visual component
export default assign({}, {

    build (schema) {
        var model = this.model,
            visualGroup = model.visualGroup;
        // no visual group, the visual is not used in a group
        // create its own group
        if (!visualGroup) {
            visualGroup = this.createGroup();
        } else {
            visualGroup.visuals[schema.name] = model;
        }
    }
}, vizComponent);
