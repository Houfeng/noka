const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const { resolve } = require('path');

const { NODE_ENV } = process.env;

module.exports = {
  mode: NODE_ENV || 'production',
  entry: './app/index.tsx',
  output: {
    path: resolve(__dirname, './public/app/'),
    filename: '[name]-[hash].bundle.js',
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10
        },
      },
    }
  },
  target: 'web',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['browser', 'module', 'main'],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: require.resolve('./app/tsconfig.json'),
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ]
  },
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : false,
  devServer: {
    port: 8081,
    liveReload: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchFiles: ["app/**/*"],
  },
  plugins: [
    new webpack.DefinePlugin({
      OBER_CONFIG: JSON.stringify({ mode: 'property' }),
    }),
    new WebpackManifestPlugin({
      publicPath: NODE_ENV === 'development'
        ? 'http://{host}:8081/' : '/app/',
      fileName: 'in-manifest.json',
      filter: (it) => it.isInitial || it.path.endsWith('.css'),
      serialize: (manifest) => {
        const items = Object.values(manifest);
        const styles = items.filter(it => it.endsWith('.css'));
        const scripts = items.filter(it => it.endsWith('.js'));
        return JSON.stringify({ styles, scripts })
      },
      writeToFileEmit: true,
    }),
    new CompressionPlugin()
  ],
};