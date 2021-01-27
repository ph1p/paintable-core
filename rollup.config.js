// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import html from '@open-wc/rollup-plugin-html';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';

const htmlTemplate = ({ entrypoints }) => {
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
    ${entrypoints.map(({ importPath }) => `<script src="${importPath}"></script>`)}
  </head>
  <body>
    <canvas id="canvas" height="500" width="500"></canvas><br /><br />

    <button id="activate">activate</button><br /><br />
    <button id="switch">switch to other paintable</button><br /><br />
    <button id="undo">undo</button>
    <button id="redo">redo</button><br /><br /><br />
    <button id="save">save</button>
    <button id="cancel">cancel</button><br /><br />
    <button id="pencil">eraser</button><br /><br />

    <div>
      <input id="lineWidth" type="range" min="1" max="70" value="5" />
      <label for="lineWidth">line-width <span id="line-width-value">5</span>px</label>
    </div>
    <div>
      <input id="accuracy" type="range" min="1" max="30" value="4" />
      <label for="accuracy">accuracy <span id="accuracy-value">4</span>px</label>
    </div>

    <br />

    <input id="color" type="color" value="#000000" />
    <button id="clear">clear</button>

    <script>
      let scope = 'my-scope-name';
      const paintable = new Paintable({
        scope,
        canvas: document.querySelector('#canvas'),
        color: '#000000',
        accuracy: 4
      });

      document.querySelector('#switch').addEventListener('click', () => {
        scope = scope === 'my-scope-name' ? 'paintable' : 'my-scope-name';

        paintable.setScope(scope);
      });
      document
        .querySelector('#lineWidth')
        .addEventListener('input', (e) => {
          paintable.setLineWidth(e.currentTarget.value);
          setTexts();
        });
      document.querySelector('#color').addEventListener('input', (e) => paintable.setColor(e.currentTarget.value));
      document.querySelector('#undo').addEventListener('click', () => paintable.undo());
      document.querySelector('#redo').addEventListener('click', () => paintable.redo());
      document.querySelector('#save').addEventListener('click', () => {
        paintable.save();
        setTexts();
      });
      document.querySelector('#cancel').addEventListener('click', () => {
        paintable.cancel();
        setTexts();
      });
      document.querySelector('#activate').addEventListener('click', () => {
        paintable.setActive(!paintable.isActive);
        setTexts();
      });
      document.querySelector('#pencil').addEventListener('click', () => {
        paintable.setEraser(!paintable.isEraser);
        setTexts();
      });
      document.querySelector('#clear').addEventListener('click', () => {
        paintable.clear(true);
        paintable.save();
      });
      document.querySelector('#accuracy').addEventListener('input', (e) => {
        const value = parseInt(e.currentTarget.value);
        if(!isNaN(value) && value >= 0) {
          paintable.setAccuracy(value);
          setTexts();
        }
      });


      function setTexts() {
        document.querySelector('#activate').innerText = paintable.isActive ? 'deactivate' : 'activate';
        document.querySelector('#pencil').innerText = paintable.isEraser ? 'pencil' : 'eraser';
        document.querySelector('#accuracy-value').innerText = paintable.accuracy;
        document.querySelector('#line-width-value').innerText = paintable.lineWidth;
      }
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
