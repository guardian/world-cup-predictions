var gulp = require('gulp');
var http = require('http');
var serverPort = 3000;

function startExpress() {
  var express = require('express');
  var app = express();
  app.use(express.static(__dirname));
  app.listen(4000);
}

gulp.task('default', function() {
	console.log('world cup prediction api here');
	startExpress();
});