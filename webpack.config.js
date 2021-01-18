const baseConfig = (config) => ({
  mode: process.env.NODE_ENV || 'development',
  // devtool: 'eval',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  ...config,
});

const configs = [];

// node
configs.push(
  baseConfig({
    output: {
      filename: 'index.js',
    },
    target: 'node',
  }),
);

// web
configs.push(
  baseConfig({
    output: {
      filename: 'index.web.js',
      library: 'Paintable',
      libraryExport: 'Paintable',
    },
  }),
);

// esm
configs.push(
  baseConfig({
    output: {
      filename: 'index.esm.js',
      module: true,
      // iife: false,
    },
    experiments: {
      outputModule: true,
    },
  }),
);

module.exports = configs;
