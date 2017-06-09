import {require} from 'd3-require';
//
// Use clusterize.js to render the table
export default function (table, options) {
    return require('clusterize.js@0.17.6').then(Clusterize => clusterize(Clusterize, table, options));
}


function clusterize(Clusterize, table, options) {
    var cl = new Clusterize();
    return cl;
}
