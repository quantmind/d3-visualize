import vizClass from '../utils/class';
import sources from './sources/index';


export function vizClass(model => {
    var series = map();

    Object.defineProperties(this, {
        series: {
            get () {
                return series;
            }
        }
    });

    this.model = model;
},
{
    size () {
        return this.series.size();
    },

    // Add a new serie from a provider
    add (config) {
        return providers.create(this, config);
    },

});
