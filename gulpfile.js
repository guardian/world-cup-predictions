var gulp = require('gulp');
var minify = require('gulp-minify-css');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var stripDebug = require('gulp-strip-debug');
var rjs = require('gulp-requirejs');
var connect = require('gulp-connect');
var awspublish = require('gulp-awspublish');
var fs = require('fs');
var rename = require('gulp-rename');

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
		port: 80,
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

// S3 Deploy
gulp.task('publish', function() {
    // Load aws credentials from a file. { key: '...',  secret: '...', bucket: '...' }
    var aws = JSON.parse(fs.readFileSync('aws.json'));
    var publisher = awspublish.create(aws);
    var headers = {
         'Cache-Control': 'max-age=180, public'
    };

    return gulp.src('./client/**/*.*')
        .pipe(rename(function (path) {
            path.dirname = '/next-gen/football/ng-interactive/2014/jun/world-cup-predictions/' + path.dirname;
        }))
        // publisher will add Content-Length, Content-Type and  headers specified above
        // If not specified it will set x-amz-acl to public-read by default
       .pipe(publisher.publish(headers))
       .pipe(publisher.cache())
        // print upload updates to console
        .pipe(awspublish.reporter());
});

gulp.task('deploy', ['client', 'publish']);

