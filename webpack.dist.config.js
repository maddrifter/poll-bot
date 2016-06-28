var webpack = require('webpack');
var path    = require('path');
var config  = require('./webpack.config');

config.output = {
  filename: '[name].bundle.js',
  publicPath: '',
  path: path.resolve(__dirname, 'public')
};

config.plugins = config.plugins.concat([

  // Reduces bundles total size
  new webpack.optimize.UglifyJsPlugin({
    mangle: {

      // You can specify all variables that should not be mangled.
      // For example if your vendor dependency doesn't use modules
      // and relies on global variables. Most of angular modules relies on
      // angular global variable, so we should keep it unchanged
      except: ['$super', '$', 'exports', 'require', 'angular']
    }
  }),

  new webpack.DefinePlugin({
      ENV: {
        firebaseConfig: {
            apiKey: '"AIzaSyAqtKx_JN8tF0ApX0mepSStOx71cxVfmYA"',
            authDomain: '"pollbot-dev.firebaseapp.com"',
            databaseURL: '"https://pollbot-dev.firebaseio.com"',
            storageBucket: '"pollbot-dev.appspot.com"',
            messagingSenderId: '"193801942276"'
        },
        appURL: '"https://app.leopoll.io/callback"'
      }
  })
]);

module.exports = config;
