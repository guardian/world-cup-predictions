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

// Check there's a match ID in the the query string
if (!matchID) {
    $el.html('<p>Missing matchid</p>');
} else {
    // Convert match ID into a int and fetch the data
    matchID = parseInt(matchID.trim(), 10);
    fetchData();
}
