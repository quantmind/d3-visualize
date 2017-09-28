import {isArray} from 'd3-let';
import {map} from 'd3-collection';
import crossfilter from 'crossfilter';

import accessor from '../utils/accessor';


export default function DataFrame (data, serie, store) {
    if (isArray(data)) data = {
        store: store,
        data: data,
        dimensions: {},
        series: map()
    };
    Object.defineProperties(this, {
        _inner: {
            get () {
                return data;
            }
        },
        store: {
            get () {
                return data.store;
            }
        },
        data: {
            get () {
                return data.data;
            }
        },
        dimensions: {
            get () {
                return data.dimensions;
            }
        },
        series: {
            get () {
                return data.series;
            }
        }
    });
    this.serie = serie;
}


DataFrame.prototype = {

    size () {
        return this.data.length;
    },

    new (serie) {
        if (isArray(serie)) return new DataFrame(serie, null, this.store);
        else return new DataFrame(this._inner, serie);
    },

    cf () {
        if (!this._inner.cf) this._inner.cf = crossfilter(this.data);
        return this._inner.cf;
    },

    //  Create and return a crossfilter dimension
    //  If value is not specified, keepExisting is by default true, and any
    //  existing dimension name is recycled.
    dimension (name, value, keepExisting) {
        if (arguments.length === 1) keepExisting = true;
        var current = this.dimensions[name];
        if (current) {
            if (keepExisting) return current;
            current.dispose();
        }
        if (!value) value = accessor(name);
        this.dimensions[name] = this.cf().dimension(value);
        return this.dimensions[name];
    },

    //  Sort a dataframe by name and return the top values or all of them if
    //  top is not defined. The name can be a function.
    sortby (name, top) {
        return this.new(this.dimension(name).top(top || Infinity));
    },

    // return a new dataframe by pivoting values for field name
    pivot (dimension, key, value, total) {
        var group = this.dimension(dimension).group();
        if (!total) total = 'total';
        return this.new(group.reduce(pivoter(1), pivoter(-1), Object).all().map(d => d.value));

        function pivoter (m) {
            let pk, pv;
            return function (o, record) {
                pk = ''+record[key];
                pv = m*record[value];
                o[dimension] = record[dimension];
                if (pk in o) o[pk] += pv;
                else o[pk] = pv;
                if (total in o) o[total] += pv;
                else o[total] = pv;
                return o;
            };
        }
    },

    add () {
        //this._inner.cf.add(data);
    },

    map (mapper) {
        return this.new(this.data.map(mapper));
    }
};
