var express = require('express');
var bodyParser = require('body-parser');
var monk = require('monk');
var cors = require('cors');
var db = monk('localhost:27017/wcp');
var app = express();
var whitelist = ['http://chronos.theguardian.com','http://localhost:8000', 'http://interactive.guim.co.uk'];

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

// Does a map reduce to determine the hive mind prediction for any match Id
var hiveMindPrediction = function(matchId) {
	var predictions = db.get('predictions');




	return {alphaScore: alphaScore, betaScore: betaScore};
};

// Find all the predictions for this completed match and mark the outcome
var markUserScoresByMatch = function(matchId, alphaScore, betaScore) {
	var predictionsForMatch = db.get('predictions');
	var predictions = predictionsForMatch.find({}, function(e, docs) {
		for (var d in docs) {
			var userId = docs[d].id;
			for (var m in docs[d]) {
				var currentPrediction = docs[d][m];
				if (parseInt(m, 10) === parseInt(matchId, 10)) {
					var setObject = {};
					setObject[matchId + '.predictedScore'] = true;
					if (currentPrediction.alphaScore === alphaScore && currentPrediction.betaScore === betaScore) {
						var updateStatement = matchId + '.predictedScore';
						predictionsForMatch.update({id: userId}, {$set: setObject});
					} else {
						predictionsForMatch.update({id: userId}, {$unset: setObject});
					}
				}
			}
		}
	});
};

// Server returns trusted timestamp
app.get('/timestamp', function(req, res) {
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

// Retrieve a user's total score so far from the database
app.get('/score/:id', function(req, res) {
	var userId = parseInt(req.params.id, 10);
	var predictions = db.get('predictions');
	var userScore = 0;
	var userPredictions = predictions.find({id: userId}, {sort: {timestamp: 1}}, function(e, docs) {
		
		for (var p in docs[0]) {
			var prediction = docs[0][p];
			if (prediction.hasOwnProperty('predictedScore')) {
				userScore++;
			}
		}

		res.send({
			'id': userId,
			'score': userScore
		});
	});
});

// Submit scores for matches that have been completed
app.get('/matches', function(req, res) {
	var matches = db.get('schedule');
	var timestamp = Math.floor(Date.now() / 1000);

	var matchList = matches.find({timestamp: {$lt: timestamp}}, {sort: {timestamp: 1}}, function(e, docs) {
		res.render('match', {match: docs});
	});
});

// E-mail to the user (nightly based on )
// E-mail can be sent IF matches played earlier and user made a prediction
app.get('/email/:id', function(req, res) {

});

// Mark completed matches and update predictions
// Match is closed for predictions, calculate hive mind score and save in a collection
app.post('/matches', function(req, res) {
	var matches = db.get('schedule');
	var predictions = db.get('predictions');
	var matchId = parseInt(req.body.matchId, 10);
	var alphaScore = parseInt(req.body.alphaScore, 10);
	var betaScore = parseInt(req.body.betaScore, 10);

	matches.update({matchId: matchId}, {$set: {alphaScore: alphaScore, betaScore: betaScore}}, {upsert: false});
	markUserScoresByMatch(matchId, alphaScore, betaScore);

	var selectionObject = {};
	selectionObject[matchId] = 1;

	var hivePredictions = predictions.group(selectionObject,{},{count: 0},function(cur, result){result.count++;},function(e, docs) {
		var hivePrediction = docs[0][matchId];
		console.log(docs);
		// console.log({alphaScore: hivePrediction.alphaScore, betaScore: hivePrediction.betaScore});
	});

	res.send({redirect: '/matches'});
});

// What does the hive mind think about this match? Run a map reduce on the predictions database
app.get('/hive/:id', function(req, res) {
	var predictions = db.get('predictions');
	var matchId = parseInt(req.params.id, 10);

	var selectionObject = {};
	selectionObject[matchId] = 1;
	selectionObject['_id'] = 0;

	var predictionSet = predictions.find({}, {fields: selectionObject}, function(e, docs) {

		var predictionArray = [];
		var predictionFrequency = {};

		for (var p in docs) {
			predictionArray.push(docs[p][matchId]);
		}

		predictionArray.filter(function(value) {
			console.log(value);
		});

		// console.log(predictionArray);

		predictionArray.forEach(function(value) {
			value['count'] = 0;
			predictionFrequency[value] = 0;
		});

		console.log(predictionFrequency);

		var uniques = predictionArray.filter(function(value) {
			return ++predictionFrequency[value] == 1;
		});


		var result = uniques.sort(function(a, b) {
			return frequency[b] - frequency[a];
		});

		res.end();
	});


	// var predictionsReduce = predictions.group(selectionObject,{}, {count: 0}, function(cur, result){result.count++;},function(e, docs) {
	// 	var modalPrediction = docs[0][matchId];
	// 	res.render('hive', {alphaScore: modalPrediction.alphaScore, betaScore: modalPrediction.betaScore});
	// });

});

// Update an existing preediction. Check for valid submission date
app.put('/prediction/:id', function(req, res) {
	var prediction = req.body;
	var predictionMatchId = parseInt(req.body.id, 10);
	var userId = parseInt(req.params.id, 10);

	var predictions = db.get('predictions');
	predictions.update({id: userId}, prediction, {upsert: true});

	res.end();
});

// Insert a new prediction. Check for valid submission date
app.post('/prediction', function(req, res) {
	var prediction = req.body;
	var predictions = db.get('predictions');
	var userId = parseInt(prediction.userId, 10);

	predictions.update({id: userId}, prediction, {upsert: true});

	res.end();
});