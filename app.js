var express = require('express');
var app = express();


var vistorID = 1;

// Discussion API get visitor number and ID
var discussionIdentity = vistorID;

app.get('/', function(req, res){
  res.send('worldcup predication machine');
  console.log('LOAD index page now');
});

app.listen(3000);