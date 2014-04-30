var gulp = require('gulp');
var http = require('http');
var serverPort = 3000;

function startExpress() {
  var express = require('express');
  var app = express();
  console.log(express.static(__dirname));
  app.use(express.static(__dirname + '/client'));
  app.listen(4000);
}

gulp.task('default', function() {
	startExpress();
});