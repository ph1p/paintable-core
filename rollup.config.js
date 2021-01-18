// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
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
    plugins: [
      ...config.plugins,
      serve({
        contentBase: ['dist', 'example'],
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
        terser(),
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
      plugins: [typescript(), terser()],
    },
    {
      ...config,
      output: {
        ...config.output,
        sourcemap: false,
      },
      plugins: [...config.plugins, terser()],
    },
  ];
}

export default config;
