import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
    input: 'index.js',
    output: {
        file: 'build/d3-visualize.js',
        format: 'umd',
        name: 'd3',
        sourcemap: true,
        extend: true,
        globals: {
            "crossfilter": "crossfilter",
            "d3-array": "d3",
            "d3-axis": "d3",
            "d3-canvas-transition": "d3",
            "d3-collection": "d3",
            "d3-color": "d3",
            "d3-dispatch": "d3",
            "d3-dsv": "d3",
            "d3-format": "d3",
            "d3-let": "d3",
            "d3-random": "d3",
            "d3-require": "d3",
            "d3-scale": "d3",
            "d3-shape": "d3",
            "d3-selection": "d3",
            "d3-svg-legend": "d3",
            "d3-timer": "d3",
            "d3-time-format": "d3",
            "d3-transition": "d3",
            "d3-view": "d3",
            "object-assign": "assign"
        }
    },
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        }),
        sourcemaps()
    ],
    external: [
        "crossfilter",
        "d3-array",
        "d3-axis",
        "d3-collection",
        "d3-color",
        "d3-dispatch",
        "d3-dsv",
        "d3-format",
        "d3-let",
        "d3-random",
        "d3-require",
        "d3-selection",
        "d3-scale",
        "d3-shape",
        "d3-svg-legend",
        "d3-timer",
        "d3-time-format",
        "d3-transition",
        "d3-view",
        "object-assign"
    ]
};
