// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import html from '@open-wc/rollup-plugin-html';
import fs from 'fs';
import path from 'path';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';

let config = {
  input: 'src/index.ts',
  output: {
    file: 'dist/paintable.js',
    name: 'window',
    esModule: false,
    extend: true,
    format: 'iife',
    exports: 'named',
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          target: 'es5',
        },
      },
    }),
  ],
};
if (process.env.NODE_ENV === 'development') {
  config = {
    ...config,
    output: {
      ...config.output,
      file: undefined,
      dir: 'dev',
    },
    plugins: [
      ...config.plugins,
      serve({
        contentBase: ['dev'],
      }),
      html({
        inject: false,
        template() {
          let exampleFile = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
          exampleFile = exampleFile.replace('https://cdn.jsdelivr.net/npm/@paintable/core', 'index.js');

          return exampleFile;
        },
      }),
    ],
  };
} else {
  config = [
    {
      input: 'src/index.ts',
      output: {
        file: 'dist/paintable.common.js',
        format: 'cjs',
        name: 'Paintable',
        exports: 'named',
      },
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              declaration: true,
              target: 'es5',
            },
          },
        }),
        terser({ format: { comments: false } }),
      ],
    },
    {
      input: 'src/index.ts',
      output: {
        file: 'dist/paintable.esm.js',
        format: 'esm',
        name: 'Paintable',
        esModule: false,
        exports: 'named',
      },
      plugins: [typescript(), terser({ format: { comments: false } })],
    },
    {
      ...config,
      output: {
        ...config.output,
        sourcemap: false,
      },
      plugins: [...config.plugins, terser({ format: { comments: false } })],
    },
  ];
}

export default config;
