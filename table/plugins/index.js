import clusterize from './clusterize';
import paginate from './paginate';
import bootstrap from './bootstrap';

// plugins add functionalities to a d3 table
// A plugin is a function accepting two parameters:
//  * the table component
//  * object with configuration parameters
export default {
    bootstrap,
    clusterize,
    paginate
};
