const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { resolve } = require('path');

const { NODE_ENV } = process.env;

module.exports = {
  mode: NODE_ENV || 'production',
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
  devtool: 'inline-source-map',
  devServer: {
    port: 8081,
    liveReload: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      OBER_CONFIG: JSON.stringify({ mode: 'property' }),
    }),
    new WebpackManifestPlugin({
      publicPath: NODE_ENV === 'development'
        ? 'http://127.0.0.1:8081/' : '/app/',
      fileName: 'pi-manifest.json',
      filter: (it) => it.isInitial || it.path.endsWith('.css'),
      serialize: (manifest) => {
        const items = Object.values(manifest);
        const styles = items.filter(it => it.endsWith('.css'));
        const scripts = items.filter(it => it.endsWith('.js'));
        return JSON.stringify({ styles, scripts })
      },
      writeToFileEmit: true,
    }),
  ],
};