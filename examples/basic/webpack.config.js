const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInjectScriptPlugin = require("../../index.js");

module.exports = {
  mode: 'development',
  entry:  path.join(__dirname, '/src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new HtmlWebpackInjectScriptPlugin({
      filename: path.join(__dirname, "/src/config.js"),
    })
  ]
};