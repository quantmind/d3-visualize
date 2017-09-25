import {viewModel} from 'd3-view';

import createVisual from './base';


export const containerPrototype = {

    initialise (element, model) {
        if (!model) model = viewModel();
        this.model = model;
        this.visualParent = model.visualParent;
    }
};


export default createVisual('container', containerPrototype);
