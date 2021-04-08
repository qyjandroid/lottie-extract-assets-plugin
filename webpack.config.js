const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LottieExtractAssetsPlugin=require("./src/plugins/index.js");
const assert = require('assert');
const fs = require('fs');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new LottieExtractAssetsPlugin({path:"./lottieConfig.json"})
  ]
}