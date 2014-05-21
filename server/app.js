var express = require('express');
var monk = require('monk');
var cors = require('cors');
var db = monk('localhost:27017/wcp');
var app = express();
var whitelist = ['http://chronos.theguardian.com'];
var corsOptions = {
	origin: function (origin, callback) {
		var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
		callback(null, originIsWhitelisted);
	}
};

app.use(cors(corsOptions));
app.listen(3000);

app.get('/',function(req, res){
  db.driver.admin.listDatabases(function(e,dbs){
      res.json(dbs);
  });
});

app.use(function(req, res, next) {
	req.db = db;
	next();
});

app.get('/schedule/', function(req, res) {
	var schedule = db.get('schedule');

	schedule.find({}, function(e, docs) {
		res.json(docs);
	});

	// res.send(JSON.Stringify(schedule));
});