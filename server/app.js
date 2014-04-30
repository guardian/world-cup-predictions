var express = require('express');
var app = express();

var vistorID = 1;

// Discussion API get visitor number and ID
var discussionIdentity = vistorID;

app.get('/', function(req, res){
  res.send('world cup prediction api here');
});

app.listen(3000);