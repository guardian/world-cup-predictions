var gulp = require('gulp');
var replace = require('gulp-replace');
var minify = require('gulp-minify-css');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var stripDebug = require('gulp-strip-debug');
var rjs = require('gulp-requirejs');
var connect = require('gulp-connect');
var awspublish = require('gulp-awspublish');
var fs = require('fs');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

var urls = {
    local: 'http://chronos.theguardian.com:8000/',
    remote: 'http://interactive.guim.co.uk/next-gen/football/ng-interactive/2014/jun/world-cup-predictions/'
};

gulp.task('styles', function() {
	return gulp.src('./client/less/styles.less')
		.pipe(less({
			paths: ['./client/less/']
		}))
		.pipe(gulp.dest('./dist/css/'));
});

gulp.task('server', function() {
    nodemon({
        script: './server/app.js',
        ignore: ['node_modules/'],
        watch: 'server/'
    }).on('restart', function () {
    });
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});


gulp.task('connect', function() {
	connect.server({
		root: './dist/',
		port: 8000,
		livereload: true
	});
});

gulp.task('remote_baseurl', function(){
  return gulp.src(['client/boot.js'])
    .pipe(replace(/@@baseURL/g, urls.remote))
    .pipe(gulp.dest('dist/boot.js'));
});

gulp.task('local_baseurl', function(){
  return gulp.src(['client/boot.js'])
    .pipe(replace(/@@baseURL/ig, urls.local))
    .pipe(gulp.dest('dist/'));
});


gulp.task('watch', function () {
  gulp.watch('./client/**/*.*', ['local_build']);
});

gulp.task('copy', ['clean'], function() {
    return gulp.src(['client/**/*.*', '!client/boot.js', '!client/less/**/*'], { base: '' })
        .pipe(gulp.dest('dist'));
});


gulp.task('local_build', function(callback) {
    return runSequence('copy', 'styles', 'local_baseurl', callback);
});

gulp.task('remote_build', function(callback) {
    return runSequence('copy', 'styles', 'remote_baseurl', callback);
});


// Main task. Start server and watch for changes
gulp.task('default', function(callback) {
  runSequence('local_build', 'connect', 'watch', callback);
});



// gulp.task('build', function() {
// 	rjs({
// 		baseUrl: 'client/',
// 		out: 'app.js',
// 		name: 'app',
// 		inlineText: true,
// 		paths: {
// 			'backbone': 'lib/backbone',
// 			'underscore': 'lib/underscore',
// 			'jquery': 'lib/jquery',
// 			'modal': 'lib/jquery.modal',
// 			'text': 'lib/text',
// 			'_fetchText': 'lib/_fetchText'
// 		}
// 	})
// 	.pipe(gulp.dest('./build/'));
// });

// S3 Deploy
gulp.task('publish', function() {
    // Load aws credentials from a file. { key: '...',  secret: '...', bucket: '...' }
    var aws = JSON.parse(fs.readFileSync('aws.json'));
    var publisher = awspublish.create(aws);
    var headers = {
         'Cache-Control': 'max-age=180, public'
    };

    return gulp.src('./dist/**/*.*')
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

gulp.task('deploy', function(callback) {
    runSequence('remote_build', 'publish', callback);
});

