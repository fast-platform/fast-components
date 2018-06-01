/* global __dirname, require, module*/
const config = {
  output: {
      filename: 'fast-components.js',
      libraryTarget: 'umd',
      umdNamedDefine: true
  },
  module: {
      rules: [
          { test: /\.js$/, loader: 'babel-loader' },
          {
              test: /\.css$/,
              use: [
                  { loader: 'style-loader' },
                  {
                      loader: 'css-loader',
                      options: {
                          modules: false
                      }
                  }
              ]
          }
      ]
  }
};

module.exports = config;