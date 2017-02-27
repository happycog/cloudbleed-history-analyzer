// const path = require('path');

module.exports = {
  context: __dirname + "/src/renderer",

  entry: "./browser.es6",
  target: "electron",
  output: {
    filename: "renderer.js",
    path: __dirname + "/js",
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.es6']
  },
  module: {
    loaders: [
      {
        test: /\.es6?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      }
    ]
  }
};
