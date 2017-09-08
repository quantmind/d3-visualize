import assign from 'object-assign';

//  Chart prototype
//  ===================
//
//  A chart is the
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
