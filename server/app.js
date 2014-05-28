var express = require('express');
var bodyParser = require('body-parser');
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
app.use(bodyParser());
app.listen(3000);

// Middleware
app.use(function(req, res, next) {
	req.db = db;
	next();
});

// Server returns trusted timestamp
app.get('/timestamp', function(req, res) {
	res.send({'timestamp': Date.now()});
});

// Full match schedule
app.get('/schedule/', function(req, res) {
	var schedule = db.get('schedule');

	schedule.find({}, function(e, docs) {
		res.json(docs);
	});
});

// Retrieve a user's prediction from the database
app.get('/prediction/:id', function(req, res) {
	var prediction = db.get('predictions');

	prediction.find({id: req.params.id}, function(e, docs) {
		res.json(docs[0]);
	});
});

// Update an existing preediction. Check for valid submission date
app.put('/prediction/:id', function(req, res) {
	var prediction = req.body;
	var predictions = db.get('predictions');
	predictions.update({id: req.params.id}, prediction, {upsert: true});

	res.send({'status': 'prediction updated'});
});

// Insert a new prediction. Check for valid submission date
app.post('/prediction', function(req, res) {
	var prediction = req.body;
	var predictions = db.get('predictions');
	predictions.update({id: prediction.userId}, prediction, {upsert: true});

	res.send({'status': 'prediction inserted'});
});