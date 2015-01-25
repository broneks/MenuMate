var gulp    = require('gulp');
var path    = require('path');
var watch   = require('gulp-watch');
var sass    = require('gulp-sass');
var neat    = require('node-neat').includePaths;
var jshint  = require('gulp-jshint');

var jshintConfig = {
	strict: true,
	unused: true,
	curly:  true,
	eqeqeq: true,
	lastsemic: true,
	indent: 2,
};

gulp.task('scss', function() {
	gulp.src('./app/scss/*.scss')
    .pipe(sass({
    	includePaths: neat
    }))
    .pipe(gulp.dest('./app/css'));
});

gulp.task('jshint', function() {
	gulp.src([
			'./app/js/**/*.js',
			'!./app/js/tags/**/*.js'
     ])
		.pipe(jshint(jshintConfig))
		.pipe(jshint.reporter('default'), {
			verbose: true
		});
});

gulp.task('default', function() {
	gulp.watch('./app/scss/**/*.scss', ['scss']);
	gulp.watch([
		'./app/js/**/*.js',
		'!./app/js/tags/**/*.js'
	], ['jshint']);
});