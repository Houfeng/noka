const { resolve } = require('path');

module.exports = {
  mode: "production",
  entry: './client/src/index.ts',
  output: {
    path: resolve(__dirname, './assets'),
    filename: 'app.bundle.js',
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