var express = require('express');
var monk = require('monk');

var db = monk('localhost:27017/wcp');

var app = express();

app.use(function(req, res, next) {
	req.db = db;
	next();
})

app.get('/', function(req, res) {
  res.send('world cup prediction api here');
});

app.listen(3000);