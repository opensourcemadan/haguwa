// Gulp.js configuration
'use strict';

const

  // source and build folders
  dir = {
    src         : '/wamp64/www/abdrivingWp/app/',
    build       : '/wamp64/www/abdrivingWp/wp-content/themes/abdriving/'
  },

  // Gulp and plugins
  gulp          = require('gulp'),
  gutil         = require('gulp-util'),
  newer         = require('gulp-newer'),
  imagemin      = require('gulp-imagemin'),
  sass          = require('gulp-sass'),
  postcss       = require('gulp-postcss'),
  deporder      = require('gulp-deporder'),
  concat        = require('gulp-concat'),
  stripdebug    = require('gulp-strip-debug'),
  uglify        = require('gulp-uglify'),
  browsersync = require('browser-sync').create()
;

// var browsersync = false;
// Browsersync options

var syncOpts = {
  proxy       : 'http://localhost/abdrivingWp/',
  port: 8001,
};

function browserSync(done) {
  browsersync.init(syncOpts);
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}


// PHP settings
const php = {
  src           : dir.src + 'template/**/*.php',
  build         : dir.build
};

// copy PHP files
function phpN() {
  return gulp.src(php.src)
    .pipe(newer(php.build))
    .pipe(gulp.dest(php.build));
};



// image settings
const images = {
  src         : dir.src + 'images/**/*',
  build       : dir.build + 'images/'
};

// image processing
function imageMin() {
  return gulp.src(images.src)
    .pipe(newer(images.build))
    .pipe(imagemin())
    .pipe(gulp.dest(images.build));
};

// CSS settings
var scss = {
  src         : dir.src + 'scss/**/*.scss',
  watch       : dir.src + 'scss/**/*',
  build       : dir.build,
  sassOpts: {
    outputStyle     : 'expanded',
    imagePath       : images.build,
    precision       : 3,
    errLogToConsole : true
  },
  processors: [
    require('postcss-assets')({
      loadPaths: ['/wamp64/www/abdrivingWp/app/images/'],
      basePath: dir.build,
      baseUrl: '/wamp64/www/abdrivingWp/wp-content/themes/abdriving/'
    }),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 2%']
    }),
    require('css-mqpacker'),
    require('cssnano'),
  ]
};


// CSS processing
function css() {
// gulp.task('scss', gulp.series('images'), () => {
  return gulp.src(scss.src)
    .pipe(sass(scss.scss))
    .pipe(postcss(scss.processors))
    .pipe(gulp.dest(scss.build))
    .pipe(browsersync.stream());
};

// JavaScript settings
const js = {
  src         : dir.src + 'js/**/*',
  build       : dir.build + 'js/',
  filename    : 'scripts.js'
};

// JavaScript processing
function javaScript() {
  return gulp.src(js.src)
    .pipe(deporder())
    .pipe(concat(js.filename))
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(gulp.dest(js.build))
    .pipe(browsersync.stream());
};
  

// watch for file changes
function watchFiles() {

  // page changes
  gulp.watch(php.src, gulp.series(phpN, browserSyncReload));

  // image changes
  gulp.watch(images.src, gulp.series(imageMin, browserSyncReload));

    // CSS changes
  gulp.watch(scss.watch, gulp.series(css));

  // JavaScript main changes
  gulp.watch(js.src, gulp.series(javaScript));

};

// define complex tasks
const scripts = gulp.series(javaScript);
const build = gulp.parallel(phpN, imageMin, css, scripts);
const watch = gulp.parallel(watchFiles, browserSync);



// export tasks
exports.imageMin = imageMin;
exports.css = css;
exports.phpN = phpN;
exports.scripts = scripts;
exports.build = build;
exports.watch = watch;
exports.default = build;
