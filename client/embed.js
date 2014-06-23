 /*
    World Cup prediction game
*/

var API_ENDPOINT = 'http://ec2-54-216-188-17.eu-west-1.compute.amazonaws.com/schedule/';

// Query param util
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


// Setup
var matchID = getParameterByName('matchid');
var $el = $('#inner');
var templateHTML = $('.template').html();
var teamplte = _.template(templateHTML);
var matchIndex = null;


function handleJSON(data) {
    // Find the match in the data
    var match = _.find(data, function(match) {
        return match.matchId === matchID;
    });

    // Check that we have found the match
    if (!match) {
        $el.html('<p>No match found with ID: ' + matchID + '</p>');
        return;
    }

    // Populate template data
    var templateData = {
        alphaTeam: 'bob'
    };

    match.histogram = getHistogramData(match.stats.frequencyHistogram);
    console.log(JSON.stringify(match, null, '  '));

    // Render the template into the page
    $el.html(teamplte(match));
}


// Fetch the data from the API endpoint
function fetchData() {
    $.ajax({
        url: API_ENDPOINT,
        crossDomain: true,
        success: handleJSON
    });
}


function getHistogramData(data) {
    var totalCount = 0;
    var histogramData = {
        "-5": 0,
        "-4": 0,
        "-3": 0,
        "-2": 0,
        "-1": 0,
        "0" : 0,
        "1" : 0,
        "2" : 0,
        "3" : 0,
        "4" : 0,
        "5" : 0
    };

    for (var score in data) {
        // Skip any erroneous properties
        if (!data.hasOwnProperty(score) || score.indexOf(':') === -1) {
           continue;
        }

        var aScore = parseInt(score.split(':')[0], 10);
        var bScore = parseInt(score.split(':')[1], 10);
        var goalDif =  bScore - aScore;

        // Exclude silly predictions
        if (goalDif < -5 || goalDif > 5) {
            continue;
        }

        // Count up scores
        if (goalDif in histogramData) {
            histogramData[goalDif] += data[score];
        } else {
            histogramData[goalDif] = data[score];
        }

        totalCount += data[score];
    }

    // Sort and order goal diffs into an array
    var sortedData = [];
    var counts = [];
    for (var result in histogramData) {
        if (histogramData.hasOwnProperty(result)) {
            var goals = parseInt(result, 10);
            // var percentage = (histogramData[result] / totalCount) * 100;
            counts.push(histogramData[result]);
            sortedData.push([goals, histogramData[result]]);
        }
    }

    sortedData.sort(function(a, b) {
        return a[0] - b[0];
    });

    var maxCount = Math.max.apply(Math, counts);
    sortedData.forEach(function(result) {
        var percentage = (result[1] / maxCount) * 100;
        result.push(percentage);
    });



    return {
        total: totalCount,
        goalDif: sortedData
    };
}


// Check there's a match ID in the the query string
if (!matchID) {
    $el.html('<p>Missing matchid</p>');
} else {
    // Convert match ID into a int and fetch the data
    matchID = parseInt(matchID.trim(), 10);
    fetchData();
}
