import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
    input: 'src/require.js',
    output: {
        file: 'build/d3-require.js',
        format: 'umd',
        sourcemap: true,
        extend: true,
        name: 'd3'
    },
    plugins: [
        json(),
        babel({
            babelrc: false,
            runtimeHelpers: true,
            presets: ['es2015-rollup']
        }),
        sourcemaps()
    ]
};
