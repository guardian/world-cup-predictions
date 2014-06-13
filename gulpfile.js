var gulp = require('gulp');
var minify = require('gulp-minify-css');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var stripDebug = require('gulp-strip-debug');
var rjs = require('gulp-requirejs');
var connect = require('gulp-connect');

gulp.task('styles', function() {
	return gulp.src('./client/less/styles.less')
		.pipe(less({
			paths: ['./client/less/']
		}))
		.pipe(minify())
		.pipe(gulp.dest('./client/css/'));
});


gulp.task('serve', function() {
	connect.server({
		root: './',
		port: 8000,
		livereload: true
	});
});

gulp.task('server', function() {
	nodemon({
		script: './server/app.js',
		ignore: ['node_modules/'],
		watch: 'server/'
	}).on('restart', function () {
	});
});

gulp.task('client', function() {
	gulp.watch('./client/less/styles.less', ['styles']);
	// gulp.watch('./client/', ['templates']);
});

gulp.task('build', function() {
	rjs({
		baseUrl: 'client/',
		out: 'app.js',
		name: 'app',
		inlineText: true,
		paths: {
			'backbone': 'lib/backbone',
			'underscore': 'lib/underscore',
			'jquery': 'lib/jquery',
			'modal': 'lib/jquery.modal',
			'text': 'lib/text',
			'_fetchText': 'lib/_fetchText'
		}
	})
	.pipe(gulp.dest('./build/'));
});