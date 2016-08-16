var gulp = require('gulp');
var fs = require("fs");
var browserify = require("browserify");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var sync = require('run-sequence');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var stripCssComments = require('gulp-strip-css-comments');



gulp.task('scripts', function () {
   return gulp.src([
        'public/js/components/canvas/canvas.js',
        'public/build/bundle.min.js'
      ])
      .pipe(concat('app.min.js'))
      .pipe(gulp.dest('public/dist'));

});

gulp.task('css', function () {
   return gulp.src([
         'node_modules/bootstrap-grid/dist/grid.min.css',
         'public/css/body.css',
         'public/css/loaderbars.css',
         'public/css/loadbounce.css',
         'public/css/nav.css',
         'public/css/askbid.css',
         'public/css/table.css',
         'public/css/positionblocks.css',
         'public/css/tradecards.css',
         'public/css/loadpulse.css',
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
      ])
      .pipe(stripCssComments())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(concat('app.min.css'))
      .pipe(gulp.dest('public/dist'))
});



gulp.task('default', function (done) {
		sync(  'scripts','css' ,done); 

});

