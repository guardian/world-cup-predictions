var express = require('express');
var bodyParser = require('body-parser');
var monk = require('monk');
var cors = require('cors');
var db = monk('localhost:27017/wcp');
var verifyGUCookie = require('./verifyGuardianCookie');
var app = express();
var whitelist = [
	'http://chronos.theguardian.com',
	'http://daan.theguardian.com',
	'http://localhost:8000',
	'http://interactive.guim.co.uk',
	'http://54.220.127.152:9000',
	'http://preview.gutools.co.uk',
	'http://www.theguardian.com'
];

var corsOptions = {
	origin: function (origin, callback) {
		var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
		callback(null, originIsWhitelisted);
	}
};

app.use(cors(corsOptions));
app.use(bodyParser());

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.listen(3000);

// Middleware to map database to request
app.use(function(req, res, next) {
	req.db = db;
	next();
});

// Validate Guardian user cookie
function isValidUser(req) {
    var GU_U = req.body.rawResponse;
    var guardianID = req.body.id;
    return (GU_U && guardianID && verifyGUCookie(GU_U, guardianID.toString()));
}

// Server returns trusted timestamp
app.get('/timestamp/', function(req, res) {
	res.send({'timestamp': Date.now()});
});

// Full match schedule. Server invalidates matches based on trusted timestamp
app.get('/schedule/', function(req, res) {
	var schedule = db.get('schedule');
	var timestamp = Math.floor(Date.now() / 1000);

	schedule.find({}, {sort: {timestamp: 1}}, function(e, docs) {
		for (var m in docs) {
			docs[m].expiredMatch = false;
			if (docs[m].timestamp < (timestamp + 1800)) {
				docs[m].expiredMatch = true;
			}

			if (timestamp > docs[m].timestamp && timestamp < (docs[m].timestamp + 7200)) {
				docs[m].matchInProgress = true;
			}
		}
		res.json(docs);
	});
});

// Retrieve a user's prediction from the database
app.get('/prediction/:id', function(req, res) {
	var prediction = db.get('predictions');
	var userId = parseInt(req.params.id, 10);

	prediction.find({id: userId}, function(e, docs) {
		res.json(docs[0]);
	});
});

// Initialise the user in the db, with their email address
app.post('/user', function(req, res) {
	var userId = parseInt(req.body.userId, 10);
	var users = db.get('users');
	users.update({id: userId}, {id: userId, email: req.body.userEmail, username: req.body.username}, {upsert: true});
	res.end();
});

// Update an existing preediction. Check for valid submission date
app.put('/prediction/:id', function(req, res) {
	if (!isValidUser(req)) {
		res.json('401', {'msg': 'Problem with authentication.'});
		return;
	}

	delete req.body.rawResponse;
	var prediction = req.body;
	var predictionMatchId = parseInt(req.body.id, 10);
	var userId = parseInt(req.params.id, 10);

	var predictions = db.get('predictions');
	predictions.update({id: userId}, prediction, {upsert: true});

	res.end();
});

// Insert a new prediction. Check for valid submission date
app.post('/prediction', function(req, res) {
	if (!isValidUser(req)) {
		res.json('401', {'msg': 'Problem with authentication.'});
		return;
	}

	delete req.body.rawResponse;
	var prediction = req.body;
	var predictions = db.get('predictions');
	var userId = parseInt(prediction.userId, 10);

	predictions.update({id: userId}, prediction, {upsert: true});

	res.end();
});