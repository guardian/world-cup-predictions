var gulp = require('gulp');
var minify = require('gulp-minify-css');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');

gulp.task('styles', function() {
	return gulp.src('./client/less/styles.less')
		.pipe(less({
			paths: ['./client/less/']
		}))
		.pipe(minify())
		.pipe(gulp.dest('./client/css/'));
});

gulp.task('server', function() {
	nodemon({
		script: './server/app.js',
		ignore: ['node_modules/'],
		watch: 'server/'
	}).on('restart', function () {
		console.log('restarted');
	});
});

gulp.task('client', function() {
	gulp.watch('./client/less/styles.less', ['styles']);
	gulp.watch('./client/', ['templates']);
});