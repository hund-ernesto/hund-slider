const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = merge( common, {
  entry: './examples/index.js',
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      // HTML
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      title: 'Development',
      template: "./examples/index.html",
      filename: "./index.html",
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
    hot: true,
    open: true,
  },
} );