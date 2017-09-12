import assign from 'object-assign';

//  Chart prototype
//  ===================
//
//  A chart is the atomic component of d3-isualize
//  it defines a mapping from a data serie to a visual 
export const chartPrototype = {
    initialise () {},
    draw () {}
};


// Create a new Chart Constructor
export default function (name, proto) {
    var chart = assign({}, chartPrototype, proto);
    chart.type = name;

    function Chart(...o) {
        this.initialise(...o);
    }

    Chart.prototype = chart;
    return Chart;
}
