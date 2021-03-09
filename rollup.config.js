import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const input = './src/index.js';
const minifyExtension = (pathToFile) => pathToFile.replace(/\.js$/, '.min.js');

const external_namespace = 'WebsketchExt';

export default [
  {
    input,
    onwarn: function (message, next) {
      console.error(message);
      process.exit(-1);
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true
      }),
      external(),
      resolve(),
      commonjs(),
      terser()
    ],
    output: [
      {
        file: pkg.module,
        format: 'umd',
        globals: {
          react: 'React',
          'styled-components': 'styled',
          'react-helmet': 'react-helmet'
        },
        name: `${external_namespace}.${pkg.name}`
      }
    ]
  }
];
