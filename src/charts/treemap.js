import createChart from '../core/chart';

//
//  Treemap
//  =============
//
export default createChart('treemap', {
    requires: ['d3-hierarchy'],

    options: {
        padding: 0.1
    },

    doDraw () {
    }
});
