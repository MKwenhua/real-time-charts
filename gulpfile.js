const gulp = require('gulp');
const fs = require("fs");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const sync = require('run-sequence');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const stripCssComments = require('gulp-strip-css-comments');

gulp.task('scripts', function () {
   return gulp.src(['public/js/components/canvas/canvasJS.js', 'public/build/bundle.min.js']).pipe(concat('app.min.js')).pipe(gulp.dest('public/dist'));

});

gulp.task('css', function () {
   return gulp.src([
      'node_modules/bootstrap-grid/dist/grid.min.css',
      'public/css/body.css',
      'public/css/loaderbars.css',
      'public/css/loadbounce.css',
      'public/css/trendline.css',
      'public/css/nav.css',
      'public/css/askbid.css',
      'public/css/table.css',
      'public/css/positionblocks.css',
      'public/css/tradecards.css',
      'public/css/loadpulse.css',
      'public/css/maps.css',
      'public/css/buttons.css',
      'public/css/chartnav.css',
      'public/css/chartcolors.css',
      'public/css/chartconfig.css',
      'public/css/canvaschart.css',
      'public/css/chartclasses.css',
      'public/css/chartadd.css',
      'public/css/listanimations.css',
      'public/css/spreads.css',
      'public/css/tradelist.css',
      'public/css/animations.css',
      'public/css/modals.css',
      'public/css/chart-top-opts.css',
      'public/css/dashboard.css',
      'public/css/media_queries.css'
   ]).pipe(stripCssComments()).pipe(cleanCSS()).pipe(sourcemaps.write()).pipe(concat('app.min.css')).pipe(gulp.dest('public/dist'))
});

gulp.task('default', function (done) {
   sync('scripts', 'css', done);

});
