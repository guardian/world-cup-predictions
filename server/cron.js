var monk = require('monk');
var db = monk('localhost:27017/wcp');
var Spreadsheet = require('google-spreadsheets');

(function() {

	// var scheduleSheet = new Spreadsheet('1Ynv8BPmp-T6VsIDODDJydzwqjJrEtN-Q1AdSQ9v6Tbk');

	console.info('Checking match schedule');

	Spreadsheet({
		key: "1nl-OIfuieE4YaGkqPRBFwrITzBQnmWuoH0qDEqKdmks"
	}, function(err, spreadsheet) {

		console.info(spreadsheet);

		spreadsheet.worksheets[0].cells({
			range: "R1C1:R5C5"
		}, function(err, cells) {
			// Cells will contain a 2 dimensional array with all cell data in the
			// range requested.
			console.log(cells);
		});
	});


//	scheduleSheet.getRows(1, function(err, row) {

	// });

	console.info('Done');
	process.exit();
})();