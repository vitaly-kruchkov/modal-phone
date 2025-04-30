import { string } from 'rollup-plugin-string';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
  },
  plugins: [
    string({
      include: '**/*.css',
    }),
    typescript(),
  ],
};