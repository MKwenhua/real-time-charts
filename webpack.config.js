const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./public/js/main.js",
   resolve: {
   extensions: ['.js', '.jsx'],
   alias: {
     dashboard: path.resolve( __dirname, 'public/js/components/dashboard'),
     components:  path.resolve( __dirname, 'public/js/components'),
     svg:  path.resolve( __dirname, 'public/js/components/svg'),
     canvas:  path.resolve( __dirname, 'public/js/components/canvas'),
     Canvas2DContext:  path.resolve( __dirname, 'public/js/components/canvas/ctxcomponents/ctxContextSet.js'),
     container:  path.resolve( __dirname, 'public/js/containers'),
     helper:  path.resolve( __dirname, 'public/js/helpers'),
     graph_helpers:  path.resolve( __dirname, 'public/js/helpers/graph_helper'),
     micro: path.resolve( __dirname, 'public/js/components/micro'),
     data: path.resolve( __dirname, 'public/js/data'),
     topnav:  path.resolve( __dirname, 'public/js/containers/topnav')
   }
  },
  module: {
    loaders: [
      {
       test: /\.jsx?$/,
       exclude: /(node_modules|bower_components)/,
       loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [ 'transform-decorators-legacy'],
        }
      }
    ]
  },
  output: {
    path: __dirname + "/public/build/",
    filename: "bundle.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new webpack.DefinePlugin({
       'process.env': {
         'NODE_ENV': JSON.stringify('production')
         }
    })

  ],
};
