var webpack = require('webpack');
var path    = require('path');
var config  = require('./webpack.config');

config.output = {
  filename: '[name].bundle.js',
  publicPath: '/',
  path: path.resolve(__dirname, 'client')
};

config.plugins = config.plugins.concat([

  // Adds webpack HMR support. It act's like livereload,
  // reloading page after webpack rebuilt modules.
  // It also updates stylesheets and inline assets without page reloading.
  new webpack.HotModuleReplacementPlugin(),

  new webpack.DefinePlugin({
      ENV: {
        firebaseConfig: {
            apiKey: '"AIzaSyAqtKx_JN8tF0ApX0mepSStOx71cxVfmYA"',
            authDomain: '"pollbot-dev.firebaseapp.com"',
            databaseURL: '"https://pollbot-dev.firebaseio.com"',
            storageBucket: '"pollbot-dev.appspot.com"',
            messagingSenderId: '"193801942276"'
        },
        appURL: '"http://localhost:3000/callback"'
      }
  })
]);

module.exports = config;
