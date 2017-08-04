var gulp = require('gulp'),
	sass = require('gulp-sass'),
	babel = require('gulp-babel'),
	webserver = require('gulp-webserver'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	browserify = require('browserify'),
	source     = require('vinyl-source-stream'),
	bufferr     = require("vinyl-buffer"),
	sourcemaps = require('gulp-sourcemaps'),
	babelify = require('babelify'),
	env = require('gulp-env');

gulp.task('html', function(){
		gulp.src("app/index.html");
	});

gulp.task('webserver', function() {
  	gulp.src("app")
    .pipe(webserver({
      livereload: true,
      open: true,
      port: 3000
    }));
});

gulp.task('script',function(){
  	browserify("dist/js/common.js")
    .transform('babelify', {presets: ["es2015", "react", "stage-0"]})
    .bundle()
    .pipe(source("common.min.js"))
    .pipe(bufferr())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(uglify({
		compress: {
			warnings: false
			}
		}))
  	.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/js/'))
    ;
});

gulp.task('libs', function(){
	gulp.src(["dist/libs/jquery/jquery-1.11.2.min.js","dist/libs/mask/mask.js"])
	.pipe(uglify({
		compress: {
			warnings: false
			}
		}))
	.pipe(rename({
		basename: "libs",
		suffix: ".min"
	}))
	.pipe(gulp.dest('app/libs'));
});

gulp.task('css',  function(){
	gulp.src('dist/sass/*.sass')
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : '_'}))
	.pipe(autoprefixer({
		browsers: ['last 15 versions'],
		cascade: false
	}))
	.pipe(minifycss())
	.pipe(gulp.dest('app/css/'));
});

gulp.task('watch', function() {
	gulp.watch('dist/**/*.sass', ['css']);
	gulp.watch('dist/**/*.js', ['script']);
	gulp.watch('app/*.html',['html']);
});

gulp.task('set-env', function () {
  env({
    vars: {
      NODE_ENV: "production"
    }
  })
});

gulp.task('default', ['set-env','html', 'css', 'libs', 'script', 'webserver','watch']);
