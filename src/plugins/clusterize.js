//
// Use clusterize.js to render the table
export default function (table, options) {
    return table.require('clusterize.js@0.17.6').then(Clusterize => clusterize(Clusterize, table, options));
}


function clusterize(Clusterize) {
    var cl = new Clusterize();
    return cl;
}
