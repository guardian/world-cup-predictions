var gulp = require('gulp');
var http = require('http');
var cors = require('cors');
var minify = require('gulp-minify-css');
var less = require('gulp-less');

var serverPort = 3000;

function startExpress() {
	var express = require('express');
	var app = express();

	var whitelist = ['http://chronos.theguardian.com'];

	 var corsOptions = {
	     origin: function (origin, callback) {
	         var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
	         callback(null, originIsWhitelisted);
	     }
	 };

	app.use(cors(corsOptions));
	app.use(express.static(__dirname + '/server'));
	app.listen(4000);
}

gulp.task('styles', function() {
	return gulp.src('./client/less/styles.less')
		.pipe(less({
			paths: ['./client/less/']
		}))
		.pipe(minify())
		.pipe(gulp.dest('./client/css/'));
})

gulp.task('server', function() {
	startExpress();
})

gulp.task('client', function() {
	gulp.watch('./client/less/styles.less', ['styles']);
})