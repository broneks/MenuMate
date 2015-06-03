var gulp       = require('gulp');
var plumber    = require('gulp-plumber');
var browserify = require('gulp-browserify');
var uglify     = require('gulp-uglify');
var minify     = require('gulp-minify-css');
var sass       = require('gulp-sass');
var bourbon    = require('node-bourbon').includePaths;

var debug = true;

gulp.task('scripts', function() {
  gulp.src('app/main.js')
    .pipe(plumber())
    .pipe(browserify({
        debug: debug,
        transform: ['reactify']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('sass', function() {
  gulp.src('sass/base.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: bourbon,
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('normalize', function() {
  gulp.src('node_modules/normalize.css/normalize.css')
    .pipe(minify())
    .pipe(gulp.dest('public/css/'));
});

gulp.task('default', ['scripts', 'sass', 'normalize'], function() {
  gulp.watch(['app/**/*.jsx', 'app/**/*.js'], ['scripts']);

  gulp.watch(['sass/**/*.scss'], ['sass']);
});
