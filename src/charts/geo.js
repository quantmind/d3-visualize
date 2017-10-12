import createChart from '../core/chart';
//
//  GeoChart
//  =============
//
//  A chart displaying a geographical map
export default createChart('geochart', {

    options: {
        // the geometry needed it by this geo chart
        geometry: null
    },

    doDraw () {
        //var box = this.boundingBox();
    }
});
