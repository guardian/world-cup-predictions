var monk = require('monk');
var db = monk('localhost:27017/wcp');
var Spreadsheet = require('edit-google-spreadsheet');

(function() {
	console.info('Checking match schedule');

	Spreadsheet.load({
		debug: true,
		spreadsheetId: '1nl-OIfuieE4YaGkqPRBFwrITzBQnmWuoH0qDEqKdmks',
		worksheetName: 'Schedule',
		oauth: {
			email: '581237799105-frtletbnc3iecf3cr86qqe7hodepcavd.apps.googleusercontent.com',
			keyFile: './wcp-spreadsheet.pem'
		}
	}, function sheetReady(err, spreadsheet) {

		if (err) {
			throw err;
		}

		spreadsheet.receive(function(err, rows, info) {
			if (err) {
				throw err;
			}

			console.dir(rows);
			console.dir(info);

		});

	});


	function markUserScore() {
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

			// console.log(predictionFrequency);

			var uniques = predictionArray.filter(function(value) {
				return ++predictionFrequency[value] == 1;
			});


			var result = uniques.sort(function(a, b) {
				return frequency[b] - frequency[a];
			});

			res.end();
		});

	}

	console.info('Done');
	process.exit();
})();