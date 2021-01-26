// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import html from '@open-wc/rollup-plugin-html';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';

const htmlTemplate = (bundle) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>paintable-core</title>
    <style>
      canvas {
        background-color: #f5f5f5;
      }
    </style>
    ${bundle.entrypoints.map((bundle) => `<script src="${bundle.importPath}"></script>`)}
  </head>
  <body>
    <canvas id="canvas" height="500" width="500"></canvas><br />

    <button id="activate">activate</button><br /><br />
    <button id="switch">switch to other paintable</button><br /><br />
    <button id="undo">undo</button>
    <button id="redo">redo</button><br /><br />
    <button id="save">save</button>
    <button id="load">load</button><br /><br />
    <button id="cancel">cancel</button>
    <button id="clear">clear</button>
    <input id="lineWidth" type="range" min="5" max="70" value="5" />
    <input id="color" type="color" value="#000000" />

    <script>
      const paintable = new Paintable();

      paintable.setCanvas(document.querySelector('#canvas'));
      paintable.setColor('#000000');

      document.querySelector('#switch').addEventListener('click', () => paintable.setName('paintable2'));
      document
        .querySelector('#lineWidth')
        .addEventListener('input', (e) => paintable.setLineWidth(e.currentTarget.value));
      document.querySelector('#color').addEventListener('input', (e) => paintable.setColor(e.currentTarget.value));
      document.querySelector('#undo').addEventListener('click', () => paintable.undo());
      document.querySelector('#redo').addEventListener('click', () => paintable.redo());
      document.querySelector('#save').addEventListener('click', () => paintable.save());
      document.querySelector('#load').addEventListener('click', () => paintable.load());
      document.querySelector('#cancel').addEventListener('click', () => paintable.cancel());
      document.querySelector('#activate').addEventListener('click', () => paintable.setActive(!paintable.isActive));
      document.querySelector('#clear').addEventListener('click', () => {
        paintable.clear();
        paintable.save();
      });
    </script>
  </body>
</html>`;
};

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

if (process.env.NODE_ENV === 'public') {
  config = {
    ...config,
    output: {
      ...config.output,
      file: undefined,
      dir: 'public',
      entryFileNames: 'paintable.js',
    },
    plugins: [
      ...config.plugins,
      html({
        inject: false,
        template: ({ bundle }) => htmlTemplate(bundle),
      }),
    ],
  };
}

if (process.env.NODE_ENV === 'development') {
  config = {
    ...config,
    output: {
      ...config.output,
      file: undefined,
      dir: 'dist',
      entryFileNames: 'paintable.js',
    },
    plugins: [
      ...config.plugins,
      serve({
        contentBase: ['dist'],
      }),
      html({
        inject: false,
        template: ({ bundle }) => htmlTemplate(bundle),
      }),
    ],
  };
}

if (process.env.NODE_ENV === 'production') {
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
          useTsconfigDeclarationDir: true,
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
