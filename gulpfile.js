var gulp = require('gulp');
var watch = require('gulp-watch');
var less = require('gulp-less');
var pug = require('gulp-pug');
var minify = require('gulp-minify');
var browserSync = require('browser-sync').create();
// var beautify = require('gulp-beautify');
var prettify = require('gulp-prettify');
var plumber = require('gulp-plumber');
var cached = require('gulp-cached');
//var beautify = require('gulp-beautify');
//var gulpPugBeautify = require('gulp-pug-beautify');
var runsequence = require('run-sequence');
var image = require('gulp-image-resize');

//paths
var buildpath = './app';

gulp.task('less', function(){
	return gulp.src('less/*.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(browserSync.reload({
		  stream: true
		}))
		.pipe(gulp.dest(buildpath));
});
gulp.task('pug', function(){
  return gulp.src('./templates/*.pug')
	.pipe(plumber())
  .pipe(pug())
	.pipe(prettify())
  .pipe(browserSync.reload({stream: true}))
  .pipe(gulp.dest(buildpath));
});
gulp.task('js', function(){
  return gulp.src('js/*.js')
  //.pipe(minify())
  .pipe(browserSync.reload({stream: true}))
  .pipe(gulp.dest(buildpath));
});
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: buildpath,port:8082
    },
  })
});
gulp.task('watch',function(){
  runsequence('less','pug','js','logo','image','browserSync',function(e){
  });
  gulp.watch('less/*.less',['less']);
  gulp.watch('templates/*.pug',['pug']);
  gulp.watch('js/*.js',['js']);
});

gulp.task('logo',function(){
	return gulp.src('assets/logo.png')
	.pipe(image({width:128,height:128}))
	.pipe(gulp.dest(buildpath+'/images/'))
});
gulp.task('image',function(){
	return gulp.src('assets/*.png')
	.pipe(gulp.dest(buildpath+'/images/'))
});
