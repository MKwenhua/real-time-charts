const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: debug ? "inline-sourcemap" : null,
  entry:  "./public/js/main.js",
   resolve: {
   extensions: ['.js', '.jsx'],
   alias: {
     canvas:  path.resolve( __dirname, 'public/js/components/canvas'),
     Canvas2DContext:  path.resolve( __dirname, 'public/js/components/canvas/ctxcomponents/ctxContextSet.js'),
     components:  path.resolve( __dirname, 'public/js/components'),
     container:  path.resolve( __dirname, 'public/js/containers'),
     helper:  path.resolve( __dirname, 'public/js/helpers'),
     constants: path.resolve( __dirname, 'public/js/constants'),
     service: path.resolve( __dirname, 'public/js/services'),
     pure_functions: path.resolve( __dirname, 'public/js/pure_functions'),
     dashboard: path.resolve( __dirname, 'public/js/components/dashboard'),
     svg:  path.resolve( __dirname, 'public/js/components/svg'),
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
          presets: ['react', 'es2015', 'stage-2'],
          plugins: [ "transform-object-rest-spread"],
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
