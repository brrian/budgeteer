const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const base = require('./webpack.base');

module.exports = merge.smart(base, {
  devtool: 'source-map',
  entry: [path.join(__dirname, 'src/index.ts')],
  externals: [nodeExternals({})],
  mode: 'production',
  plugins: [new CleanWebpackPlugin(['dist'])],
});
