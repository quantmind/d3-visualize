import createChart from '../core/chart';

//
//  Bar Chart
//  =============
//
//  The barchart is one of the most flexible visuals.
//  It can be used to display label data as well as
//  timeserie data. It can display absulte values as
//  proportional data via vertical staking and normalization
export default createChart('boxchart', {

    options: {
        orientation: 'vertical',
    },

    doDraw () {

    }
});
