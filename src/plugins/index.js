//
//  Plugins for visuals and tabular
//
//  This module depends on core but not on components
import clusterize from './clusterize';
import paginate from './paginate';
import bootstrap from './bootstrap';

// visual plugins
import './responsive';
import './title';

// plugins add functionalities to a d3 table
// A plugin is a function accepting two parameters:
//  * the table component
//  * object with configuration parameters
export default {
    bootstrap,
    clusterize,
    paginate
};
