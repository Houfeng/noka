const webpack = require('webpack');
const { resolve } = require('path');

module.exports = {
  mode: "development",
  entry: './app/index.tsx',
  output: {
    path: resolve(__dirname, './assets/app'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      OBER_CONFIG: JSON.stringify({ mode: 'property' }),
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    port: 8081,
    hot: true,
    liveReload: true,
  },
};