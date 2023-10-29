const { resolve } = require('path');

module.exports = {
  mode: "development",
  entry: './client/src/index.tsx',
  output: {
    path: resolve(__dirname, './assets/app'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  devServer: {
    port: 8081,
    hot: true,
    liveReload: true,
  },
};