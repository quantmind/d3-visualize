import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
    input: 'index.js',
    output: {
        file: 'build/d3-visualize.js',
        format: 'umd',
        sourcemap: true
    },
    name: 'd3',
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup'],
            plugins: ["transform-async-to-generator"]
        }),
        commonjs(),
        sourcemaps()
    ],
    external: [
        "crossfilter",
        "d3-collection",
        "d3-dispatch",
        "d3-dsv",
        "d3-format",
        "d3-let",
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
