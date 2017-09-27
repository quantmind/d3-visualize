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

    add () {
        //this._inner.cf.add(data);
    },

    map (mapper) {
        return this.new(this.data.map(mapper));
    }
};
