// This script updates the app with real scores
// Scores and hive mind scores are saved to the database
// Run on a cron job (c. every 2 hours)

var monk = require('monk');
var db = monk('localhost:27017/wcp');
var Spreadsheet = require('edit-google-spreadsheet');
var fs = require('fs');

(function() {
	console.info('Checking match schedule');

	// Read the completed match data file
	fs.readFile('completedMatches.json', 'utf8', function(err, data) {

		if (err) {
			throw err;
		}

		var completedMatches;
		try {
			completedMatches = JSON.parse(data);
		} catch (e) {
			throw e;
		}

		Spreadsheet.load({
			debug: true,
			spreadsheetId: '1nl-OIfuieE4YaGkqPRBFwrITzBQnmWuoH0qDEqKdmks',
			worksheetId: 'od6',
			oauth: {
				email: '581237799105-frtletbnc3iecf3cr86qqe7hodepcavd@developer.gserviceaccount.com',
				keyFile: 'gu_client_drive_key.pem'
			}
		}, function sheetReady(err, spreadsheet) {

			if (err) {
				throw err;
			}

			spreadsheet.receive(function(err, rows, info) {
				if (err) {
					throw err;
				}

				for (var r in rows) {

					// Has the match been completed?
					var matchFinished = rows[r]['7'];
					if (matchFinished === 'TRUE') {

						var matchId = rows[r]['1'];
						var realAlphaScore = parseInt(rows[r]['8'], 10);
						var realBetaScore = parseInt(rows[r]['9'], 10);

						if (completedMatches.indexOf(matchId) > -1) {
							console.info('Match ' + matchId + ' already processed. Exiting');
							process.exit();
						} else {
							console.info('Match Id ' + matchId + ' being processed: ' + realAlphaScore + ':' + realBetaScore);
							updateSchedule(matchId, realAlphaScore, realBetaScore);
							updateHiveMind(matchId, realAlphaScore, realBetaScore);

							// Update completed matches listing
							completedMatches.push(matchId);

						}
					}

				}

				fs.writeFile('completedMatches.json', JSON.stringify(completedMatches), 'utf8', function(err) {
					if (err) {
						throw err;
					}

					console.info('All done, exiting');
					process.exit();
				});

			});

		});

	});

	function calculateModalScore(array) {
		var frequency = {};
		var max = 0;
		var result;
		for (var v in array) {
			frequency[array[v]] = (frequency[array[v]] || 0) + 1;
				if (frequency[array[v]] > max) {
					max = frequency[array[v]];
					result = array[v];
			}
		}
		return result;
	}

	function isInteger(i) {
		return i % 1 === 0;
	}

	function updateSchedule(matchId, realAlphaScore, realBetaScore) {
		var schedule = db.get('schedule');
		schedule.update({matchId: matchId}, {$set: {alphaScore: realAlphaScore, betaScore: realBetaScore}}, {upsert: false});
	}

	// Find the hive mind score and update schedule
	function updateHiveMind(matchId, realAlphaScore, realBetaScore) {
		console.log('Calculate hive mind score');
		var schedule = db.get('schedule');
		var predictions = db.get('predictions');

		var hiveAlphaScore;
		var hiveBetaScore;

		var selectionObject = {};
		selectionObject[matchId] = 1;
		selectionObject['_id'] = 0;

		var possiblePredictions = [];

		predictions.find({}, {fields: selectionObject}, function(e, docs) {

			for (var p in docs) {
				var predictionAlphaScore = docs[p][matchId].alphaScore;
				var predictionBetaScore = docs[p][matchId].betaScore;

				if (isInteger(predictionAlphaScore) && isInteger(predictionBetaScore)) {
					possiblePredictions.push(predictionAlphaScore + ':' + predictionBetaScore);
				}
			}

			var calculatedModalScore = calculateModalScore(possiblePredictions);
			var calculatedArray = calculatedModalScore.split(':');

			schedule.update({matchId: matchId}, {
				$set: {
					hiveAlphaScore: parseInt(calculatedArray[0], 10),
					hiveBetaScore: parseInt(calculatedArray[1], 10)
				}},
				{upsert: false}
			);

		});

	}

})();