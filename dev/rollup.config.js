import json from 'rollup-plugin-json';
import sourcemaps from 'rollup-plugin-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve';

const pkg = require('../package.json');
const external = Object.keys(pkg.dependencies).filter(name => name.substring(0, 3) === 'd3-');


export default {
    input: 'index.js',
    output: {
        file: 'build/d3-visualize.js',
        format: 'umd',
        name: 'd3',
        sourcemap: true,
        extend: true,
        globals: external.reduce((g, name) => {g[name] = 'd3'; return g;}, {})
    },
    plugins: [
        json(),
        sourcemaps(),
        commonjs({include: ['node_modules/**']}),
        node()
    ],
    external: external
};
