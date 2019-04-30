import typescript from 'rollup-plugin-typescript';
import tweakDefault from './build/rollup-plugin.js';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs', // esm
      exports: 'named',
    },
    {
      file: 'libesm/index.esm.js',
      format: 'esm',
      exports: 'named',
    },
  ],
  plugins: [
    typescript(),
    tweakDefault(),
  ],
};
