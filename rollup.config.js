import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
    entry: 'index.js',
    format: 'umd',
    moduleName: 'd3',
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup'],
            plugins: ["transform-async-to-generator"]
        }),
        commonjs(),
        // include d3-let in the bundle
        node(),
        sourcemaps()
    ],
    sourceMap: true,
    dest: 'build/d3-view-table.js',
    external: [
        "crossfilter",
        "d3-collection",
        "d3-dispatch",
        "d3-dsv",
        "d3-format",
        "d3-selection",
        "d3-timer",
        "d3-time-format",
        "d3-transition",
        "d3-view"
    ],
    globals: {
        "crossfilter": "crossfilter",
        "d3-collection": "d3",
        "d3-dispatch": "d3",
        "d3-dsv": "d3",
        "d3-format": "d3",
        "d3-let": "d3",
        "d3-selection": "d3",
        "d3-timer": "d3",
        "d3-time-format": "d3",
        "d3-transition": "d3",
        "d3-view": "d3"
    }
};
