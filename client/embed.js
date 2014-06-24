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
    match.totalPredictions = 0;
    for(var key in match.stats.frequencyHistogram){
        match.totalPredictions += match.stats.frequencyHistogram[key];
    }
    match.predictionBreakdown = calculateBreakDown(match.stats.frequencyHistogram);

    // Populate template data
    var templateData = {
        alphaTeam: 'bob'
    };

    match.topScores = getHistogramData(match.stats.frequencyHistogram);
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
    var sortedData = [];
    var counts = [];
    var loopCount = 0;

    for (var score in data) {
        console.log(loopCount);
        if(loopCount < 5){
            
            // Skip any erroneous properties
            if (!data.hasOwnProperty(score) || score.indexOf(':') === -1) {
               continue;
            }
            var count = parseInt(data[score], 10);
            sortedData.push([score, count]);
            counts.push(count);
            totalCount += data[score];
            loopCount++;
        }
    }

    sortedData.sort(function(a, b) {
        return a[1] - b[1];
    });

    sortedData.reverse();
    
    var maxCount = Math.max.apply(Math, counts);
    sortedData.forEach(function(result) {
        var percentage = (result[1] / maxCount) * 100;
        result.push(percentage);
    });
    // console.log(sortedData);
    return sortedData;
}

function calculateBreakDown(breakdownData){
    var breakdown = {
        alphaWin:0,
        draw: 0,
        betaWin: 0
    };
    if (breakdownData) {

        for(var key in breakdownData){
            if(key.split(':')[0] > key.split(':')[1]){
                breakdown.alphaWin += breakdownData[key];
            }else if(key.split(':')[0] < key.split(':')[1]){
                breakdown.betaWin += breakdownData[key];
            }else if(key.split(':')[0] === key.split(':')[1]){
                breakdown.draw += breakdownData[key];
            }
        }
        return breakdown;
    }
}


// Check there's a match ID in the the query string
if (!matchID) {
    $el.html('<p>Missing matchid</p>');
} else {
    // Convert match ID into a int and fetch the data
    matchID = parseInt(matchID.trim(), 10);
    fetchData();
}
