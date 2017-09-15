import {map} from 'd3-collection';

import array from './array';
import remote from './remote';
import expression from './expression';
import dataSources from './sources';


dataSources.add('array', array);
dataSources.add('remote', remote);
dataSources.add('expression', expression);

//
//  DataStore
//  ==============
//
//  Map names to datasets
//  Individual data sets are assumed to contain a collection of records
//  (or “rows”), which may contain any number of named data
//  attributes (fields, or “columns”).
//  Records are modeled using standard JavaScript objects.
export default function DataStore(model) {
    var series = map();

    Object.defineProperties(this, {
        series: {
            get () {
                return series;
            }
        }
    });

    this.dataCount = 0;
    this.model = model;
}


DataStore.prototype = {
    size () {
        return this.series.size();
    },

    // Add a new serie from a data source
    add (config) {
        return dataSources.create(config, this);
    },

    dataName (name) {
        this.dataCount++;
        if (name) return '' + name;
        var def = this.serie('default');
        if (!def) return 'default';
        return `serie${this.dataCount}`;
    }
};
