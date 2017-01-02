/**
 * Configuration
 */
var project = {
	devUrl: 'inlineblock.dev',
	stylesInput: './src/styles',
	stylesOutput: './assets/css',
	scriptsInput: './src/js',
	scriptsOutput: './assets/js'
};

var autoprefixerOptions = {
	browsers: ['last 2 versions'],
};



/**
 * Dependencies
 */
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var nano = require('gulp-cssnano');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
// var order = require("gulp-order");
// var addsrc = require('gulp-add-src');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');



/**
 * Uncomment to log start up time of Gulp tasks
 */
// require('gulp-stats')(gulp);



/**
 * BrowserSync
 */
var reload = browserSync.reload;

gulp.task('browser-sync', function () {
	browserSync({
		proxy: project.devUrl,
		host: 'localhost',
		port: 8888,
		injectChanges: true
	});
});



/**
 * SASS
 */
gulp.task('sass', function () {
	gulp.src(project.stylesInput + '/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({ style: 'compressed' }))
		.on("error", notify.onError(function (error) { return error.message; }))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(project.stylesOutput))
		.pipe(browserSync.reload({ stream: true }));
});


/**
 * JavaScript
 */
gulp.task('js', function () {
	gulp.src(project.scriptsInput + '/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		//.pipe(addsrc(scriptsInput + 'libs/*.js'))
		// .pipe(addsrc('./src/js/libs/*.js'))
		// .pipe(order([
		// 		//'js/libs/jquery-2.1.4.min.js',
		// 		//'js/libs/smartresize.js',
		// 		'js/main.js'
		// 	]))
		.pipe(concat('scripts.min.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(gulp.dest(project.scriptsOutput))
		.pipe(browserSync.reload({ stream: true }));
});



/**
 * Default task
 */
gulp.task('default', ['sass', 'browser-sync', 'js'], function () {
	gulp.watch(project.stylesInput + '/**/*.scss', ['sass']);
	gulp.watch(project.scriptsInput + '/*.js', ['js']);
	gulp.watch('*.php').on('change', reload);
});



/**
 * Build task
 */
gulp.task('build', function () {
	gulp.src(project.stylesInput + '/*.scss')
		.pipe(sass())
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(nano())
		.pipe(gulp.dest(project.stylesOutput));
});