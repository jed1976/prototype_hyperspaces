const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const filesize = require('rollup-plugin-filesize');
const terser = require('rollup-plugin-terser');

module.exports = [
  {
    input: 'src/index.js',
    plugins: [
      resolve(),
      babel(),
      filesize({ showMinifiedSize: false })
    ],
    output: {
      file: 'dist/json_logic.esm.js',
      format: 'esm',
      name: 'jsonLogic',
      exports: 'default',
      sourcemap: true,
    },
  },
  {
    input: 'src/index.js',
    plugins: [
      resolve(),
      babel(),
      terser.terser(),
      filesize({ showMinifiedSize: false }),
    ],
    output: {
      file: 'dist/json_logic.esm.min.js',
      format: 'esm',
      name: 'jsonLogic',
      exports: 'default',
      sourcemap: true,
    },
  },
];
